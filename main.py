import json
import os
import argparse
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

from comfy_api import ComfyAPI

# Default ComfyUI server address
COMFY_SERVER = "127.0.0.1:8188"

# Default templates
TEMPLATE_T2V = r"d:\Ltx2_3_t2v_GGUF.json"
TEMPLATE_I2V = r"d:\Ltx2_3_i2v_GGUF.json"
TEMPLATE_T2I = r"d:\image_z_image_turbo_api.json"

# Output directory for results
OUTPUT_DIR = Path("D:/가족/output")
OUTPUT_DIR.mkdir(exist_ok=True, parents=True)

def run_workflow(prompt_text, mode="t2v", input_image=None, input_audio=None, seed=None, template_path=None):
    # Determine the template path
    if not template_path:
        if mode == "t2v":
            template_path = TEMPLATE_T2V
        elif mode == "i2v":
            template_path = TEMPLATE_I2V
        elif mode == "t2i":
            template_path = TEMPLATE_T2I
        
    if not os.path.exists(template_path):
        print(f"Error: Template workflow not found at: {template_path}", file=sys.stderr)
        return False
        
    print(f"Loading workflow template: {template_path}")
    with open(template_path, "r", encoding="utf-8") as f:
        workflow = json.load(f)
    
    # ─── Configure Parameters ────────────────────────────────────────────────
    
    # Configure Text Prompt & Seed based on workflow mode
    if mode == "t2v":
        # Positive Prompt (Node 242: PrimitiveStringMultiline in T2V template)
        if "242" in workflow:
            workflow["242"]["inputs"]["value"] = prompt_text
            print(f"[Config] Positive prompt (T2V) updated.")
        # Seed (Node 189: RandomNoise in T2V template)
        if seed is not None and "189" in workflow:
            workflow["189"]["inputs"]["noise_seed"] = seed
            print(f"[Config] Seed (T2V) updated to: {seed}")
            
    elif mode == "t2i":
        # Positive Prompt (Node 27: CLIPTextEncode in T2I template)
        if "27" in workflow:
            workflow["27"]["inputs"]["text"] = prompt_text
            print(f"[Config] Positive prompt (T2I) updated.")
        # Seed (Node 3: KSampler in T2I template)
        if seed is not None and "3" in workflow:
            workflow["3"]["inputs"]["seed"] = seed
            print(f"[Config] Seed (T2I) updated to: {seed}")
            
    else:  # i2v mode
        # Positive Prompt (Node 263: PrimitiveStringMultiline in I2V template)
        if "263" in workflow:
            workflow["263"]["inputs"]["value"] = prompt_text
            print(f"[Config] Positive prompt (I2V) updated.")
        # Seed (Node 199: RandomNoise in I2V template)
        if seed is not None and "199" in workflow:
            workflow["199"]["inputs"]["noise_seed"] = seed
            print(f"[Config] Seed (I2V) updated to: {seed}")
            
        # Input Image (Node 98: LoadImage in I2V template)
        if input_image and "98" in workflow:
            workflow["98"]["inputs"]["image"] = os.path.basename(input_image)
            print(f"[Config] Input image set to: {os.path.basename(input_image)}")

    # Input Audio (Node 251: LoadAudio) if present in template and audio provided
    if input_audio and "251" in workflow:
        workflow["251"]["inputs"]["audio"] = os.path.basename(input_audio)
        print(f"[Config] Input audio set to: {os.path.basename(input_audio)}")

    # Initialize ComfyUI API
    api = ComfyAPI(server_address=COMFY_SERVER)
    
    # Connect WebSocket and queue prompt
    try:
        api.connect_websocket()
        print("Submitting workflow to ComfyUI...")
        prompt_id = api.send_prompt(workflow)
        print(f"Prompt queued! Prompt ID: {prompt_id}")
        
        # Monitor progress and wait for output files
        print("Waiting for generation and listening to progress updates...")
        results = api.track_progress_and_get_results(prompt_id)
        
        # Download generated files
        saved_files = []
        print("\nDownloading results...")
        for node_id, files in results.items():
            for file_info in files:
                filename = file_info["filename"]
                subfolder = file_info.get("subfolder", "")
                folder_type = file_info.get("type", "output")
                
                print(f"Downloading '{filename}' from Node {node_id}...")
                file_data = api.download_file(filename, subfolder, folder_type)
                
                out_file_path = OUTPUT_DIR / filename
                with open(out_file_path, "wb") as out_file:
                    out_file.write(file_data)
                print(f"[✓] Saved successfully to: {out_file_path.absolute()}")
                saved_files.append(str(out_file_path.absolute()))
                
        if saved_files:
            print(f"SUCCESS: Generated {len(saved_files)} file(s).")
            # Write success marker for calling processes
            print(f"OUTPUT_FILES: {','.join(saved_files)}")
            return True
        else:
            print("FAILED: No output files were retrieved.", file=sys.stderr)
            return False
            
    except Exception as e:
        print(f"Error executing workflow: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="ComfyUI Workflow CLI Runner")
    parser.add_argument("--prompt", type=str, required=True, help="Positive prompt for video generation")
    parser.add_argument("--mode", type=str, choices=["t2v", "i2v", "t2i"], default="t2v", help="Workflow mode: t2v, i2v, or t2i")
    parser.add_argument("--image", type=str, default=None, help="Input image file path (required for i2v)")
    parser.add_argument("--audio", type=str, default=None, help="Input audio file path (optional)")
    parser.add_argument("--seed", type=int, default=None, help="Noise seed for KSampler")
    parser.add_argument("--template", type=str, default=None, help="Path to custom workflow JSON template")
    
    args = parser.parse_args()
    
    # Validation for i2v
    if args.mode == "i2v" and not args.image:
        print("Error: --image is required when mode is 'i2v'", file=sys.stderr)
        sys.exit(1)
        
    success = run_workflow(
        prompt_text=args.prompt,
        mode=args.mode,
        input_image=args.image,
        input_audio=args.audio,
        seed=args.seed,
        template_path=args.template
    )
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
