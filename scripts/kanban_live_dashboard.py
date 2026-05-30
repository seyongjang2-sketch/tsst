#!/usr/bin/env python3
import subprocess, time, re, os, sys
from pathlib import Path

TASKS = {
    't_0234f613': '이미지 테스트 리스트 작성',
    't_971ffe7a': 'Z-Image Turbo 후보 생성/적용',
}
ROOT = Path('/mnt/c/Users/Admin/tsst')

def run(cmd, timeout=20):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT, timeout=timeout)
    except subprocess.CalledProcessError as e:
        return e.output
    except Exception as e:
        return f'ERR: {e}'

def parse_show(tid):
    out = run(f'hermes kanban show {tid}', 30)
    d = {'raw': out, 'status':'unknown', 'assignee':'?', 'pid':'?', 'run':'?', 'started':'?', 'summary':''}
    for line in out.splitlines():
        s=line.strip()
        if s.startswith('status:'): d['status']=s.split(':',1)[1].strip()
        elif s.startswith('assignee:'): d['assignee']=s.split(':',1)[1].strip()
        elif s.startswith('started:'): d['started']=s.split(':',1)[1].strip()
        elif '[run ' in s and 'spawned' in s:
            m=re.search(r'\[run (\d+)\].*spawned.*pid\W+(\d+)', s)
            if m: d['run'], d['pid']=m.group(1), m.group(2)
        elif s.startswith('Latest summary:'):
            d['summary']='next'
    return d

def pid_alive(pid):
    if not pid or pid == '?': return False
    return Path(f'/proc/{pid}').exists()

def log_info(tid):
    out = run(f'hermes kanban log {tid}', 30)
    lines=[l for l in out.splitlines() if l.strip()]
    last = lines[-1] if lines else '(no log yet)'
    return len(lines), last[-140:]

def artifact_info():
    parts=[]
    list_file=ROOT/'reports/familyspace-hero-image-test-list.md'
    if list_file.exists(): parts.append(f'리스트 {list_file.stat().st_size}B')
    zdir=ROOT/'assets/zturbo'
    imgs=list(zdir.glob('*.png')) if zdir.exists() else []
    parts.append(f'이미지 {len(imgs)}장')
    manifest=zdir/'familyspace_zturbo_manifest.json'
    if manifest.exists(): parts.append('manifest 있음')
    return ' · '.join(parts)

def stale_hint(status, alive, log_count, last):
    if status == 'done': return '완료'
    if status in ('blocked','failed'): return '확인 필요'
    if status == 'running' and alive: return '실행 중'
    if status == 'running' and not alive: return '멈춤 의심(PID 없음)'
    if status in ('ready','todo','scheduled'): return '대기'
    return '알 수 없음'

def draw():
    print('\033[2J\033[H', end='')
    print('FamilySpace 작업 진행 대시보드')
    print(time.strftime('%Y-%m-%d %H:%M:%S'))
    print('='*100)
    print(f'산출물: {artifact_info()}')
    print('-'*100)
    for tid,name in TASKS.items():
        d=parse_show(tid)
        alive=pid_alive(d['pid'])
        lc,last=log_info(tid)
        hint=stale_hint(d['status'], alive, lc, last)
        icon={'완료':'✅','실행 중':'🟢','멈춤 의심(PID 없음)':'🔴','대기':'⏳','확인 필요':'⚠️'}.get(hint,'?')
        print(f'{icon} {tid} | {name}')
        print(f'   상태: {d["status"]} | 담당: {d["assignee"]} | run: {d["run"]} | pid: {d["pid"]} | pid_alive: {alive} | 판정: {hint}')
        print(f'   로그 줄수: {lc} | 마지막: {last}')
        print()
    print('='*100)
    print('녹색=실제 프로세스 살아있음 / 빨강=Kanban은 running인데 PID가 없어 멈춤 가능성 / Ctrl+C 종료')

if __name__ == '__main__':
    interval=int(os.environ.get('INTERVAL','10'))
    while True:
        draw(); sys.stdout.flush(); time.sleep(interval)
