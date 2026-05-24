import json
import urllib.parse
import uuid
import requests
import websocket

class ComfyAPI:
    def __init__(self, server_address="127.0.0.1:8188"):
        self.server_address = server_address
        self.client_id = str(uuid.uuid4())
        self.ws = websocket.WebSocket()
        
    def connect_websocket(self):
        """Connects to the ComfyUI WebSocket server to receive progress updates."""
        ws_url = f"ws://{self.server_address}/ws?clientId={self.client_id}"
        print(f"Connecting to WebSocket: {ws_url}")
        self.ws.connect(ws_url)
        print("WebSocket connected successfully!")

    def send_prompt(self, workflow_json):
        """Sends the workflow JSON payload to the ComfyUI queue."""
        url = f"http://{self.server_address}/prompt"
        payload = {
            "prompt": workflow_json,
            "client_id": self.client_id
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        res_data = response.json()
        return res_data["prompt_id"]

    def download_file(self, filename, subfolder="", folder_type="output"):
        """Downloads a file (image/video) from ComfyUI."""
        params = {
            "filename": filename,
            "subfolder": subfolder,
            "type": folder_type
        }
        url = f"http://{self.server_address}/view?{urllib.parse.urlencode(params)}"
        response = requests.get(url)
        response.raise_for_status()
        return response.content

    def track_progress_and_get_results(self, prompt_id):
        """
        Listens to the WebSocket for progress reports.
        Returns a dictionary of output file details mapping node_id -> list of files.
        """
        output_files = {}
        
        try:
            while True:
                out = self.ws.recv()
                if not out:
                    continue
                
                # WebSocket messages are either binary (images) or JSON strings
                if isinstance(out, str):
                    message = json.loads(out)
                    msg_type = message.get("type")
                    data = message.get("data", {})
                    
                    # Verify this message belongs to our prompt
                    if data.get("prompt_id") != prompt_id:
                        continue
                        
                    if msg_type == "status":
                        status = data.get("status", {})
                        exec_info = status.get("exec_info", {})
                        queue_remaining = exec_info.get("queue_remaining", 0)
                        print(f"[*] Queue Status: {queue_remaining} tasks remaining in queue.")
                        
                    elif msg_type == "execution_start":
                        print("[*] Execution started on ComfyUI server.")
                        
                    elif msg_type == "executing":
                        node_id = data.get("node")
                        if node_id is not None:
                            print(f"[>] Executing Node: {node_id}")
                        else:
                            # Node ID is None when execution completes
                            print("[*] Execution complete!")
                            break
                            
                    elif msg_type == "progress":
                        current_step = data.get("value", 0)
                        max_steps = data.get("max", 0)
                        percent = int((current_step / max_steps) * 100) if max_steps > 0 else 0
                        print(f"    [Sampler Progress] Step {current_step}/{max_steps} ({percent}%)")
                        
                    elif msg_type == "executed":
                        node_id = data.get("node")
                        output = data.get("output", {})
                        if "images" in output:
                            output_files[node_id] = output["images"]
                            print(f"[✓] Node {node_id} generated {len(output['images'])} image(s).")
                        elif "gifs" in output:
                            output_files[node_id] = output["gifs"]
                            print(f"[✓] Node {node_id} generated {len(output['gifs'])} animation/video(s).")
                            
                else:
                    # Binary data (preview images during generation)
                    # We can ignore previews or write to file if needed.
                    pass
        except KeyboardInterrupt:
            print("\nTracking interrupted by user.")
        
        return output_files
