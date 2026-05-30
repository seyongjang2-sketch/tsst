#!/usr/bin/env python3
import subprocess, re
from pathlib import Path
TASKS={'t_0234f613':'이미지 테스트 리스트 작성','t_971ffe7a':'Z-Image Turbo 후보 생성/적용'}
ROOT=Path('/mnt/c/Users/Admin/tsst')
def run(cmd):
    try: return subprocess.check_output(cmd,shell=True,text=True,stderr=subprocess.STDOUT,timeout=20)
    except Exception as e: return f'ERR: {e}'
def parse(tid):
    out=run(f'hermes kanban show {tid}')
    st='unknown'; pid='?'; assignee='?'; runid='?'
    for line in out.splitlines():
        s=line.strip()
        if s.startswith('status:'): st=s.split(':',1)[1].strip()
        elif s.startswith('assignee:'): assignee=s.split(':',1)[1].strip()
        elif '[run ' in s and 'spawned' in s:
            m=re.search(r'\[run (\d+)\].*pid\W+(\d+)',s)
            if m: runid,pid=m.group(1),m.group(2)
    alive=Path(f'/proc/{pid}').exists() if pid!='?' else False
    log=run(f'hermes kanban log {tid}')
    lines=[l for l in log.splitlines() if l.strip()]
    last=lines[-1][-120:] if lines else '(no log)'
    if st=='done': icon='✅'; verdict='완료'
    elif st=='running' and alive: icon='🟢'; verdict='실행 중'
    elif st=='running': icon='🔴'; verdict='멈춤 의심(PID 없음)'
    elif st in ('ready','todo','scheduled'): icon='⏳'; verdict='대기'
    else: icon='⚠️'; verdict=st
    return f'{icon} {tid} {st} {verdict} | {TASKS[tid]} | pid={pid} alive={alive} | 마지막: {last}'
imgs=list((ROOT/'assets/zturbo').glob('*.png')) if (ROOT/'assets/zturbo').exists() else []
list_file=ROOT/'reports/familyspace-hero-image-test-list.md'
print('FamilySpace 이미지 작업 상태')
print(f'산출물: 리스트={list_file.stat().st_size if list_file.exists() else 0}B, 이미지={len(imgs)}장')
for tid in TASKS: print(parse(tid))
