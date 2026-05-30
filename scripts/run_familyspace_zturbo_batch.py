#!/usr/bin/env python3
"""
Run FamilySpace hero background candidates through Z_Image_Turbo_3in1_ComboWorkflow.

Requires ComfyUI running on Windows at http://127.0.0.1:8188.
Designed for WSL: calls PowerShell/curl.exe when needed.
"""
import json, random, subprocess, tempfile, time, urllib.parse
from pathlib import Path

ROOT = Path('/mnt/c/Users/Admin/tsst')
WORKFLOW = Path('/mnt/c/Users/Admin/Desktop/Z_Image_Turbo_3in1_ComboWorkflow.json')
PROMPTS = ROOT / 'reports/z-image-turbo-familyspace-prompts-gemma.json'
BASE = ROOT / 'assets/zbase_fullmask.png'
OUTDIR = ROOT / 'assets/zturbo'
HOST = 'http://127.0.0.1:8188'
NEG = 'stock photo, glossy advertisement, overposed smiling family, direct eye contact, visible faces, flags, national costume, tourist landmark, pho, kimchi, traditional symbols, readable brand logos, distorted hands, uncanny faces, fake text, cluttered composition, oversaturated colors, harsh contrast, low quality, blurry'


def ps(cmd: str) -> str:
    return subprocess.check_output(['powershell.exe', '-NoProfile', '-Command', cmd], text=True, stderr=subprocess.STDOUT)


def winpath(p: Path) -> str:
    return subprocess.check_output(['wslpath', '-w', str(p)], text=True).strip()


def ensure_base_png():
    if BASE.exists():
        return
    # tiny pure-python RGBA PNG, transparent alpha as full mask for LoadImage mask output
    import struct, zlib
    w = h = 1024
    raw = b''.join(b'\x00' + bytes([238, 226, 211, 0]) * w for _ in range(h))
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 1)) + chunk(b'IEND', b'')
    BASE.parent.mkdir(parents=True, exist_ok=True)
    BASE.write_bytes(png)


def check_server():
    return curl_text([f'{HOST}/system_stats'], timeout=20)


def upload_base():
    ensure_base_png()
    out = curl_text(['-X', 'POST', f'{HOST}/upload/image', '-F', f'image=@{winpath(BASE)}', '-F', 'type=input', '-F', 'overwrite=true'], timeout=60)
    print(out.strip())


def curl_text(args, timeout=120):
    """Run Windows curl.exe so 127.0.0.1 resolves to the Windows ComfyUI server."""
    return subprocess.check_output(['curl.exe', '-sS', *args], text=True, stderr=subprocess.STDOUT, timeout=timeout)


def curl_json(args, timeout=120):
    return json.loads(curl_text(args, timeout=timeout))


def submit(prompt_obj, index, variant=0):
    wf = json.loads(WORKFLOW.read_text(encoding='utf-8'))
    wf['63']['inputs']['text'] = prompt_obj['positive_prompt']
    wf['62']['inputs']['text'] = prompt_obj.get('negative_prompt') or NEG
    wf['67']['inputs']['image'] = BASE.name
    wf['71']['inputs']['seed'] = random.randint(1, 10**15)
    safe_name = ''.join(c if c.isalnum() else '_' for c in prompt_obj['name'])[:42]
    wf['66']['inputs']['filename_prefix'] = f'FamilySpace/{index:02d}_{safe_name}_v{variant}'
    payload = {'prompt': wf, 'client_id': 'familyspace-zturbo-batch'}
    with tempfile.NamedTemporaryFile('w', encoding='utf-8', suffix='.json', delete=False) as f:
        json.dump(payload, f, ensure_ascii=False)
        payload_path = f.name
    res = curl_json(['-X', 'POST', f'{HOST}/prompt', '-H', 'Content-Type: application/json', '--data-binary', f'@{winpath(Path(payload_path))}'], timeout=60)
    print('submitted', index, variant, prompt_obj['name'], res)
    return res['prompt_id']


def wait_and_download(prompt_id):
    last = None
    for _ in range(160):
        try:
            hist = curl_json([f'{HOST}/history/{prompt_id}'], timeout=20)
            if prompt_id in hist and hist[prompt_id].get('outputs'):
                outs = hist[prompt_id]['outputs']
                downloaded = []
                for node, out in outs.items():
                    for im in out.get('images', []):
                        qs = urllib.parse.urlencode({'filename': im['filename'], 'subfolder': im.get('subfolder',''), 'type': im.get('type','output')})
                        url = f'{HOST}/view?{qs}'
                        OUTDIR.mkdir(parents=True, exist_ok=True)
                        dest = OUTDIR / im['filename']
                        curl_text(['-L', url, '-o', winpath(dest)], timeout=120)
                        downloaded.append(str(dest))
                return downloaded
        except Exception as e:
            last = e
        time.sleep(3)
    raise RuntimeError(f'timeout waiting for {prompt_id}: {last!r}')


def main():
    print('Checking ComfyUI...')
    print(check_server()[:500])
    upload_base()
    prompts = json.loads(PROMPTS.read_text(encoding='utf-8'))['prompts']
    selected = prompts[:6]
    all_files = []
    for i, pr in enumerate(selected, 1):
        pid = submit(pr, i, 1)
        files = wait_and_download(pid)
        all_files.extend(files)
        print('downloaded', files)
    manifest = OUTDIR / 'familyspace_zturbo_manifest.json'
    manifest.write_text(json.dumps({'files': all_files, 'source_prompts': str(PROMPTS), 'workflow': str(WORKFLOW)}, ensure_ascii=False, indent=2), encoding='utf-8')
    print('MANIFEST', manifest)
    print('\n'.join(all_files))

if __name__ == '__main__':
    main()
