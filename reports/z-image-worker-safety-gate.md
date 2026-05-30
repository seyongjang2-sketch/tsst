# Z-Image Turbo worker safety gate — REQUIRED

This project has already wasted cost/time through wrong-mode generation. Do not run image batches until this gate is complete.

## Non-negotiable rule
`Z_Image_Turbo_3in1_ComboWorkflow.json` supports T2I, I2I, and Inpaint in the UI/workflow concept. The API JSON may only reflect the currently exported branch. Before generation, the worker must explicitly verify which branch is active and suitable.

## Required preflight before any generation
1. Identify active mode:
   - T2I: Empty latent / direct text-to-image path, no required LoadImage+mask conditioning.
   - I2I: input image encoded to latent, no mask stitch path.
   - Inpaint: LoadImage + mask + InpaintCrop/InpaintConditioning/InpaintStitch path.
2. Print the active node path in the report.
3. If the active path is not T2I, do NOT batch-generate hero candidates.
4. If mode switching is needed, ask for or export the correct T2I API graph from ComfyUI before running.
5. Run exactly ONE cheap smoke test first.
6. Inspect output file visually or at least verify it is not blank/near-white before running more.
7. Only after smoke test passes, run batch generation.

## Cost guard
- Never run 6/12/20 images first.
- First run: 1 image only.
- If blank/white/wrong mode: stop and report.
- If output has face/stock/cliché/food/flag/traditional costume/tourist landmark: stop and adjust prompt before batch.

## Current known mistake
The previous run used the Inpaint branch with an empty transparent base image. That produced white/blank outputs. Do not repeat this.

## Required worker report format before batch
- Workflow file:
- Confirmed mode: T2I / I2I / Inpaint
- Active node path:
- Smoke test prompt name:
- Smoke output path:
- Smoke result: pass/fail
- Decision: proceed / stop
