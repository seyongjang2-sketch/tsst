#!/usr/bin/env python3
import argparse
import sys
from datetime import datetime
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

ROOT = Path(__file__).resolve().parents[1]
LOG_PATH = ROOT / "agents" / "project_log.md"
VALID_TYPES = {
    "decision",
    "idea",
    "content",
    "seo",
    "design",
    "asset",
    "technical",
    "qa",
    "monetization",
    "risk",
}


def read_log():
    if LOG_PATH.exists():
        return LOG_PATH.read_text(encoding="utf-8")
    return "# FamilySpace 프로젝트 로그\n\n"


def write_log(text):
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    LOG_PATH.write_text(text, encoding="utf-8", newline="\n")


def add_entry(args):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = f"""## {now} - {args.title}
- Type: {args.type}
- Owner: {args.owner}
- Status: {args.status}
- Summary: {args.summary}
- Files: {args.files}
- Validation: {args.validation}
- Decisions: {args.decisions}
- Risks: {args.risks}
- Next: {args.next}

"""
    current = read_log()
    lines = current.splitlines(keepends=True)
    insert_at = 0
    for i, line in enumerate(lines):
        if line.startswith("## "):
            insert_at = i
            break
    else:
        insert_at = len(lines)
        if not current.endswith("\n\n"):
            current = current.rstrip() + "\n\n"
            lines = current.splitlines(keepends=True)

    updated = "".join(lines[:insert_at]) + entry + "".join(lines[insert_at:])
    write_log(updated)
    print(f"logged: {LOG_PATH}")


def print_status(args):
    text = read_log()
    entries = [line.strip() for line in text.splitlines() if line.startswith("## ")]
    print("FamilySpace project log status")
    print(f"path: {LOG_PATH}")
    print(f"entries: {len(entries)}")
    for title in entries[: args.limit]:
        print(f"- {title.replace('## ', '')}")


def build_parser():
    parser = argparse.ArgumentParser(description="FamilySpace project log helper")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="append a structured log entry")
    add.add_argument("--type", required=True, choices=sorted(VALID_TYPES))
    add.add_argument("--owner", required=True)
    add.add_argument("--status", required=True, choices=["todo", "doing", "done", "blocked", "review"])
    add.add_argument("--title", required=True)
    add.add_argument("--summary", required=True)
    add.add_argument("--files", default="none")
    add.add_argument("--validation", default="not run")
    add.add_argument("--decisions", default="none")
    add.add_argument("--risks", default="none")
    add.add_argument("--next", default="none")
    add.set_defaults(func=add_entry)

    status = sub.add_parser("status", help="show latest project log entries")
    status.add_argument("--limit", type=int, default=5)
    status.set_defaults(func=print_status)

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
