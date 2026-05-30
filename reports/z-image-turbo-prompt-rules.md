# Z-Image Turbo prompt rules for FamilySpace hero backgrounds

Purpose: Generate many realistic hero background candidates for FamilySpace using `Z_Image_Turbo_3in1_ComboWorkflow.json` and Ollama-written prompts.

## Model/workflow facts to respect
- Workflow file: `/mnt/c/Users/Admin/Desktop/Z_Image_Turbo_3in1_ComboWorkflow.json`
- Positive prompt node: `63.inputs.text`
- Negative prompt node exists: `62.inputs.text`, but Z-Image Turbo guidance suggests negative prompts may be weak/ignored; important exclusions must be written inside the positive prompt.
- KSampler node: `71`, current settings: `steps: 8`, `cfg: 1`, `sampler: euler`, `scheduler: simple`, `denoise: 0.4`.
- Model: `z-image-turbo-q8_0.gguf` via GGUF UNet loader.
- CLIP: `Qwen3-4B-UD-Q6_K_XL.gguf`, type `lumina2`.

## Prompt writing rules
1. Write the prompt in English. Z-Image Turbo follows English/Chinese well; English is safer for photographic art direction.
2. Put all important constraints in the positive prompt, including what must NOT appear.
3. Avoid long poetic prose. Use clear scene description + composition + camera + lighting + constraints.
4. Use concrete physical details, not abstract brand claims.
5. Do not use national clichés:
   - no flags
   - no traditional costumes
   - no phở/kimchi symbolism
   - no tourist landmarks
   - no globe/heart/handshake clichés
6. Avoid stock-photo look:
   - no smiling family looking at camera
   - no perfect staged advertising pose
   - no glossy commercial lifestyle shot
7. Avoid privacy risk:
   - no visible full faces
   - no direct eye contact
   - use hands, backs, silhouettes, objects, home details
8. Hero usability:
   - leave clean negative space on the left or center-left for website headline
   - avoid busy high-contrast details under text area
   - image should crop well at 16:9 desktop and 4:5/mobile crop
9. Preferred subject motifs:
   - Vietnamese apartment kitchen/entryway in morning
   - refrigerator or wall family memo board
   - child’s school notebook / sổ liên lạc
   - colored pencils, small toy, water bottle
   - hospital appointment note, vaccination booklet
   - TRC/visa/family document folder
   - household budget receipt, smartphone, calendar
   - subtle Vietnamese home details: balcony plants, apartment window, motorbike helmet, tiled floor
10. Mood:
   - realistic documentary photography
   - warm natural window light
   - calm trustworthy lived-in home
   - warm ivory, muted beige, clay, gentle green
   - shallow depth of field, not overly sharp
11. Include technical style phrase:
   - `realistic documentary-style photograph, 35mm lens, warm natural morning light, shallow depth of field, authentic lived-in home, editorial web hero background`
12. Generate variants by changing scene angle, focal object, lighting, and composition. Do not just change adjectives.

## Negative prompt fallback
If the workflow uses the negative node, use:
`stock photo, glossy advertisement, overposed smiling family, direct eye contact, visible faces, flags, national costume, tourist landmark, phở, kimchi, traditional symbols, readable brand logos, distorted hands, uncanny faces, fake text, cluttered composition, oversaturated colors, harsh contrast, low quality, blurry`

## Output format for Ollama
Return exactly 12 numbered prompt objects. Each object must include:
- `name`: short Korean label
- `positive_prompt`: English prompt, 90-150 words
- `negative_prompt`: one-line fallback negative prompt
- `composition_note`: Korean note explaining crop/hero use
- `why`: Korean note explaining why this fits FamilySpace

Do not include Markdown tables. Do not explain the rules again.
