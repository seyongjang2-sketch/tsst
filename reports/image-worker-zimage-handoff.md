# FamilySpace image worker handoff — Z-Image Turbo

## Goal
Generate multiple hero background candidates for `/mnt/c/Users/Admin/tsst/index.html` using the user-specified ComfyUI workflow:

`/mnt/c/Users/Admin/Desktop/Z_Image_Turbo_3in1_ComboWorkflow.json`

Use the candidates to replace the current temporary hero background.

## Ready files
- Workflow: `/mnt/c/Users/Admin/Desktop/Z_Image_Turbo_3in1_ComboWorkflow.json`
- Prompt rules: `/mnt/c/Users/Admin/tsst/reports/z-image-turbo-prompt-rules.md`
- Ollama-generated prompts: `/mnt/c/Users/Admin/tsst/reports/z-image-turbo-familyspace-prompts-gemma.json`
- Batch runner: `/mnt/c/Users/Admin/tsst/scripts/run_familyspace_zturbo_batch.py`
- Base mask/input image: `/mnt/c/Users/Admin/tsst/assets/zbase_fullmask.png`
- Output dir: `/mnt/c/Users/Admin/tsst/assets/zturbo/`

## Confirmed workflow nodes
- Positive prompt: node `63.inputs.text`
- Negative prompt: node `62.inputs.text`
- Input image: node `67.inputs.image`
- Seed: node `71.inputs.seed`
- Save prefix: node `66.inputs.filename_prefix`

## Confirmed settings
- Model: `z-image-turbo-q8_0.gguf`
- CLIP: `Qwen3-4B-UD-Q6_K_XL.gguf`
- VAE: `ae.safetensors`
- KSampler: 8 steps, CFG 1, euler/simple, denoise 0.4

## Server
ComfyUI is running on Windows:
`http://127.0.0.1:8188`

Use PowerShell/curl.exe from WSL if direct WSL curl cannot reach it.

## Run
From WSL:

```bash
python3 /mnt/c/Users/Admin/tsst/scripts/run_familyspace_zturbo_batch.py
```

Expected output:
- Generated images copied into `/mnt/c/Users/Admin/tsst/assets/zturbo/`
- Manifest written to `/mnt/c/Users/Admin/tsst/assets/zturbo/familyspace_zturbo_manifest.json`

## Selection criteria
Pick images that:
1. Read as a real Korean-Vietnamese family home in Vietnam.
2. Show family-life evidence visually: memo board, school notebook, hospital card, TRC/visa documents, budget receipts, child items.
3. Leave clean negative space on the left for headline text.
4. Avoid all clichés: flags, traditional clothes, tourist landmarks, phở, kimchi, over-smiling stock family.
5. Avoid visible faces/direct eye contact.
6. Work as a 16:9 desktop hero and survive mobile crop.

## After choosing
Copy best candidate to:
`/mnt/c/Users/Admin/tsst/assets/familyspace-hero-board.png`

Then verify:
```bash
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
HTMLParser().feed(Path('/mnt/c/Users/Admin/tsst/index.html').read_text(encoding='utf-8'))
print('HTML parse OK')
PY
curl -s -o /tmp/index.html -w 'http=%{http_code}\n' http://127.0.0.1:8787/index.html
curl -s -o /tmp/hero.png -w 'img_http=%{http_code}\n' http://127.0.0.1:8787/assets/familyspace-hero-board.png
```
