#!/usr/bin/env python3
import subprocess, json, time, sys
TASKS = ['t_0234f613', 't_971ffe7a']
NAMES = {
    't_0234f613': '이미지 테스트 리스트 작성',
    't_971ffe7a': 'Z-Image Turbo 후보 생성/적용',
}

def sh(cmd):
    return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)

def status(tid):
    out = sh(f'hermes kanban show {tid}')
    st = 'unknown'
    for line in out.splitlines():
        if line.strip().startswith('status:'):
            st = line.split(':',1)[1].strip()
            break
    return st

while True:
    rows=[]
    for tid in TASKS:
        try: st=status(tid)
        except Exception as e: st='error'
        rows.append((tid,NAMES[tid],st))
    print('\033[2J\033[H', end='')
    print('FamilySpace 이미지 작업 진행도')
    print(time.strftime('%Y-%m-%d %H:%M:%S'))
    print('-'*60)
    for tid,name,st in rows:
        mark = {'done':'✅','running':'🔄','ready':'⏳','todo':'⏳','blocked':'⚠️','scheduled':'⏸️','error':'❌'}.get(st,'?')
        print(f'{mark} {tid}  {st:9s}  {name}')
    print('-'*60)
    print('Ctrl+C로 종료. 상세: hermes kanban show <task_id>')
    sys.stdout.flush()
    if all(st=='done' for _,_,st in rows): break
    time.sleep(20)
