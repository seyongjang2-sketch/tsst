#!/usr/bin/env python3
"""Run the FamilySpace private-test operating loop.

The loop audits the homepage, optionally asks Codex CLI to fix discovered
issues, verifies again, and can push verified changes to the configured test
remotes. It is intentionally conservative: deploy is opt-in and a dirty
workspace blocks automatic deploy unless the dirty files are explicitly created
by the current cycle.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import signal
import subprocess
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
ROOT_INBOX = Path(r"C:\Users\Admin\Documents\telegram_inbox.py")
PROJECT_LOG = ROOT / "agents" / "project_log.md"
REMOTE_URL = "https://tsst-csa.pages.dev/?check=autonomous-ops"
TASK_ID = "company-autonomous-ops-loop"
IGNORED_DIRTY_PREFIXES = ("test-results/", "reports/screenshots/autonomous/")


@dataclass
class Check:
    name: str
    ok: bool
    detail: str


class RefSrcParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str, int]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for key, value in attrs:
            if key in {"href", "src"} and value:
                self.refs.append((tag, value, self.getpos()[0]))


def run(cmd: list[str], *, timeout: int = 120) -> subprocess.CompletedProcess[str]:
    resolved = cmd[:]
    if os.name == "nt":
        found = shutil.which(cmd[0])
        found_cmd = shutil.which(f"{cmd[0]}.cmd")
        if found_cmd:
            found = found_cmd
        if found:
            resolved[0] = found
    return subprocess.run(
        resolved,
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        timeout=timeout,
        shell=False,
    )


def report(stage: str, message: str, *, room: str) -> None:
    if not ROOT_INBOX.exists():
        print(f"[report skipped] {ROOT_INBOX} not found: {message}")
        return
    cmd = [
        sys.executable,
        str(ROOT_INBOX),
        "report",
        "--room",
        room,
        "--stage",
        stage,
        "--task-id",
        TASK_ID,
        "--message",
        message,
    ]
    result = run(cmd, timeout=60)
    print(result.stdout.strip())


def git_status() -> list[str]:
    result = run(["git", "status", "--porcelain"], timeout=30)
    return [line for line in result.stdout.splitlines() if line.strip()]


def status_paths(status_lines: Iterable[str]) -> set[str]:
    paths: set[str] = set()
    for line in status_lines:
        raw = line[3:] if len(line) > 3 else line
        if " -> " in raw:
            raw = raw.split(" -> ", 1)[1]
        paths.add(raw.strip().strip('"'))
    return paths


def deployable_paths(status_lines: Iterable[str]) -> set[str]:
    paths = status_paths(status_lines)
    return {
        path
        for path in paths
        if not any(path == prefix.rstrip("/") or path.startswith(prefix) for prefix in IGNORED_DIRTY_PREFIXES)
    }


def html_files() -> list[Path]:
    return sorted(ROOT.glob("*.html"))


def parse_html() -> Check:
    bad: list[str] = []
    for file_path in html_files():
        parser = HTMLParser()
        try:
            parser.feed(file_path.read_text(encoding="utf-8"))
        except Exception as exc:  # HTMLParser can surface malformed entities.
            bad.append(f"{file_path.name}: {exc}")
    if bad:
        return Check("html-parse", False, "; ".join(bad))
    return Check("html-parse", True, f"parsed {len(html_files())} HTML files")


def static_path_check() -> Check:
    missing: list[str] = []
    ignored_prefixes = ("http://", "https://", "mailto:", "tel:", "#", "javascript:")
    for file_path in html_files():
        parser = RefSrcParser()
        parser.feed(file_path.read_text(encoding="utf-8"))
        for _tag, value, line in parser.refs:
            if value.startswith(ignored_prefixes):
                continue
            parsed = urlparse(value)
            clean = parsed.path.strip()
            if not clean or clean.startswith("#"):
                continue
            target = (ROOT / clean.lstrip("/")).resolve()
            try:
                target.relative_to(ROOT)
            except ValueError:
                missing.append(f"{file_path.name}:{line} escapes root: {value}")
                continue
            if not target.exists():
                missing.append(f"{file_path.name}:{line} missing {value}")
    if missing:
        return Check("static-paths", False, "; ".join(missing[:20]))
    return Check("static-paths", True, "all local href/src paths exist")


def diff_check() -> Check:
    result = run(["git", "diff", "--check"], timeout=60)
    return Check("git-diff-check", result.returncode == 0, result.stdout.strip() or "ok")


def operating_gate_source_check() -> Check:
    spec = ROOT / "reports" / "ops_extended_check.spec.js"
    docs = ROOT / "agents" / "daily_operating_sequence.md"
    if not spec.exists():
        return Check("operating-gate-source", False, f"missing {spec}")
    spec_text = spec.read_text(encoding="utf-8")
    docs_text = docs.read_text(encoding="utf-8").lower() if docs.exists() else ""
    required_spec_markers = [
        "local primary CTAs and floor links navigate to intended pages",
        "local pages use the shared navigation structure and floor order",
        "local index and room pages align the main navigator position",
        "homepage removes the room review drawer and duplicate preview layer",
        "page role headlines stay unique",
        "operating docs require missed-QA prevention and trend-purpose gates",
        "manifest.json",
    ]
    required_doc_markers = [
        "cta navigation",
        "shared navigation structure",
        "main navigator position",
        "missed-qa prevention",
        "trend-purpose filter",
        "screenshot evidence manifest",
    ]
    missing = [marker for marker in required_spec_markers if marker not in spec_text]
    missing += [marker for marker in required_doc_markers if marker not in docs_text]
    if missing:
        return Check("operating-gate-source", False, "missing markers: " + ", ".join(missing))
    return Check("operating-gate-source", True, "CTA, navigation-structure, navigation-position, QA-prevention, trend-purpose, role-uniqueness, and evidence-manifest gates present")


def remote_http_check() -> Check:
    try:
        req = Request(REMOTE_URL, headers={"User-Agent": "familyspace-autonomous-ops/1.0"})
        with urlopen(req, timeout=20) as response:
            body = response.read(250_000).decode("utf-8", errors="replace")
            ops_marker = "운영 실행 콘솔" in body or "테스트 운영 현황" in body
            ok = response.status == 200 and ops_marker
            detail = f"HTTP {response.status}; ops console={'yes' if ops_marker else 'no'}"
            return Check("remote-http", ok, detail)
    except Exception as exc:
        return Check("remote-http", False, str(exc))


def playwright_check() -> Check:
    spec = ROOT / "reports" / "ops_extended_check.spec.js"
    if not spec.exists():
        return Check("playwright-ops", False, f"missing {spec}")
    spec_arg = spec.relative_to(ROOT).as_posix()
    env = os.environ.copy()
    env["OPS_EVIDENCE_STAMP"] = datetime.now().strftime("%Y%m%d-%H%M%S")
    resolved = ["npx", "playwright", "test", spec_arg, "--reporter=list"]
    if os.name == "nt":
        found = shutil.which("npx.cmd") or shutil.which("npx")
        if found:
            resolved[0] = found
    result = subprocess.run(
        resolved,
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        timeout=240,
        shell=False,
        env=env,
    )
    detail = result.stdout.strip()
    return Check("playwright-ops", result.returncode == 0, detail[-3000:] if detail else "ok")


def audit(include_playwright: bool) -> list[Check]:
    checks = [diff_check(), parse_html(), static_path_check(), operating_gate_source_check(), remote_http_check()]
    if include_playwright:
        checks.append(playwright_check())
    return checks


def summarize_checks(checks: Iterable[Check]) -> str:
    parts = []
    for check in checks:
        mark = "PASS" if check.ok else "FAIL"
        parts.append(f"{mark} {check.name}: {check.detail}")
    return "\n".join(parts)


def append_project_log(title: str, summary: str, validation: str, status: str) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = f"""## {now} - {title}
- Type: technical
- Owner: web_admin
- Status: {status}
- Summary: {summary}
- Files: scripts/autonomous_ops_loop.py,agents/daily_operating_sequence.md,agents/project_log.md
- Validation: {validation}
- Decisions: Autonomous operation is allowed only inside the company/homepage private-test scope. Public operation approval is still separate.
- Risks: Automatic deploy is blocked when the workspace starts dirty or verification fails.
- Next: Run the loop with --allow-agent-edits and --allow-deploy only after the intended private-test automation policy is accepted.

"""
    current = PROJECT_LOG.read_text(encoding="utf-8") if PROJECT_LOG.exists() else "# FamilySpace project log\n\n"
    lines = current.splitlines(keepends=True)
    insert_at = next((idx for idx, line in enumerate(lines) if line.startswith("## ")), len(lines))
    PROJECT_LOG.write_text("".join(lines[:insert_at]) + entry + "".join(lines[insert_at:]), encoding="utf-8", newline="\n")


def run_codex_agent(checks: list[Check]) -> Check:
    prompt = f"""
You are operating only inside the FamilySpace company/homepage project.
Find and fix the failing private-test checks below. Do not touch video/game work.
Keep changes small, verify with local commands, and do not deploy.

Failing checks:
{summarize_checks([check for check in checks if not check.ok])}
"""
    result = run(
        [
            "codex",
            "exec",
            "--cd",
            str(ROOT),
            "--sandbox",
            "danger-full-access",
            "--ask-for-approval",
            "never",
            prompt,
        ],
        timeout=1800,
    )
    return Check("codex-agent", result.returncode == 0, result.stdout[-4000:] if result.stdout else "ok")


def commit_and_push(cycle: int, baseline_status: list[str], room: str) -> Check:
    current_status = git_status()
    if not current_status:
        return Check("deploy", True, "no file changes to deploy")

    baseline_paths = deployable_paths(baseline_status)
    current_paths = deployable_paths(current_status)
    stage_paths = sorted(current_paths - baseline_paths)
    skipped_paths = sorted(current_paths & baseline_paths)
    if not stage_paths:
        detail = "no new clean file changes to deploy"
        if skipped_paths:
            detail += f"; skipped pre-existing dirty paths: {', '.join(skipped_paths)}"
        return Check("deploy", True, detail)

    add_result = run(["git", "add", "--", *stage_paths], timeout=60)
    if add_result.returncode != 0:
        return Check("deploy", False, f"git add failed: {add_result.stdout}")
    message = f"Run autonomous ops loop cycle {cycle}"
    commit_result = run(["git", "commit", "-m", message], timeout=120)
    if commit_result.returncode != 0:
        return Check("deploy", False, f"git commit failed: {commit_result.stdout}")

    progress = f"진행: 자동 운영 루프 검증 통과 후 커밋을 만들었습니다. 이제 origin/main, origin/test, tsst/main에 private-test 배포 푸시를 시도합니다."
    report("progress", progress, room=room)

    push_results = [
        run(["git", "push", "origin", "HEAD:main"], timeout=180),
        run(["git", "push", "origin", "HEAD:test"], timeout=180),
        run(["git", "push", "tsst", "HEAD:main"], timeout=180),
    ]
    failed = [item.stdout for item in push_results if item.returncode != 0]
    if failed:
        return Check("deploy", False, "push failed: " + "\n".join(failed))
    head = run(["git", "rev-parse", "--short", "HEAD"], timeout=30).stdout.strip()
    detail = f"pushed {head} to origin/main, origin/test, tsst/main"
    if skipped_paths:
        detail += f"; skipped pre-existing dirty paths: {', '.join(skipped_paths)}"
    return Check("deploy", True, detail)


def cycle_once(args: argparse.Namespace, cycle: int) -> bool:
    baseline = git_status()
    checks = audit(args.playwright)
    print(summarize_checks(checks))
    failures = [check for check in checks if not check.ok]

    if failures:
        report("progress", f"진행: 자동 운영 루프 {cycle}회차 감사에서 문제를 발견했습니다.\n{summarize_checks(failures)}", room=args.room)
        if args.allow_agent_edits:
            agent_result = run_codex_agent(checks)
            print(f"{agent_result.name}: {agent_result.ok}\n{agent_result.detail}")
            checks = audit(args.playwright)
            failures = [check for check in checks if not check.ok]
        else:
            append_project_log(
                "autonomous ops loop issue found",
                "The loop detected issues but agent edits were not enabled.",
                summarize_checks(failures),
                "blocked",
            )
            return False

    if failures:
        append_project_log(
            "autonomous ops loop verification failed",
            "The autonomous loop found issues that remained after the cycle.",
            summarize_checks(failures),
            "blocked",
        )
        return False

    deploy_result = Check("deploy", True, "deploy disabled")
    has_new_deployable_changes = bool(deployable_paths(git_status()) - deployable_paths(baseline))
    should_log_clean_cycle = args.log_clean_cycles or has_new_deployable_changes or not args.allow_deploy

    if should_log_clean_cycle:
        append_project_log(
            "autonomous ops loop cycle",
            f"Completed autonomous audit cycle {cycle}. Deployment is handled after this log entry is written.",
            summarize_checks(checks),
            "done",
        )

    if args.allow_deploy and (has_new_deployable_changes or should_log_clean_cycle):
        deploy_result = commit_and_push(cycle, baseline, args.room)
        if not deploy_result.ok:
            append_project_log(
                "autonomous ops loop deploy failed",
                f"Autonomous audit cycle {cycle} passed, but deploy failed: {deploy_result.detail}",
                summarize_checks(checks),
                "blocked",
            )
    if deploy_result.ok:
        report("progress", f"진행: 자동 운영 루프 {cycle}회차가 통과했습니다. {deploy_result.detail}", room=args.room)
    return deploy_result.ok


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="FamilySpace autonomous private-test operating loop")
    parser.add_argument("--room", default="personal_dm", help="Telegram room for reports")
    parser.add_argument("--interval-minutes", type=float, default=60)
    parser.add_argument("--cycles", type=int, default=1, help="0 means run forever")
    parser.add_argument("--playwright", action="store_true", help="include Playwright operating-console run")
    parser.add_argument("--allow-agent-edits", action="store_true", help="let Codex CLI fix detected issues")
    parser.add_argument("--allow-deploy", action="store_true", help="commit and push verified changes")
    parser.add_argument("--log-clean-cycles", action="store_true", help="write project_log entries for clean no-change cycles")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    started = datetime.now().strftime("%Y-%m-%d %H:%M")
    report(
        "start",
        f"시작: 회사/홈페이지 자동 운영 루프를 시작합니다. 시작시각 {started}, cycles={args.cycles}, interval={args.interval_minutes}분, playwright={args.playwright}, agent_edits={args.allow_agent_edits}, deploy={args.allow_deploy}.",
        room=args.room,
    )

    cycle = 0
    all_ok = True
    stop_requested = False

    def request_stop(_signum: int, _frame: object) -> None:
        nonlocal stop_requested
        stop_requested = True

    signal.signal(signal.SIGINT, request_stop)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, request_stop)

    while not stop_requested and (args.cycles == 0 or cycle < args.cycles):
        cycle += 1
        ok = cycle_once(args, cycle)
        all_ok = all_ok and ok
        if args.cycles == 0:
            report(
                "result",
                f"중간결과: 회사/홈페이지 자동 운영 루프 {cycle}회차 완료. 현재 상태={'통과' if ok else '보류/실패'}. 장기 실행 모드라 다음 회차를 대기합니다.",
                room=args.room,
            )
        if stop_requested or (args.cycles != 0 and cycle >= args.cycles):
            break
        sleep_until = time.time() + max(args.interval_minutes, 0.1) * 60
        while not stop_requested and time.time() < sleep_until:
            time.sleep(min(5, sleep_until - time.time()))

    report(
        "result",
        f"완료: 회사/홈페이지 자동 운영 루프가 {cycle}회 실행되었습니다. 최종 상태={'통과' if all_ok else '보류/실패'}. 자세한 결과는 agents/project_log.md에 기록했습니다.",
        room=args.room,
    )
    return 0 if all_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
