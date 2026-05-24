import json
import os
import sys
import argparse
import urllib.request
import random
from pathlib import Path

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

from main import run_workflow

# Ollama API settings
OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL = "gemma4:latest" # You can change this to "deepseek-r1:32b" or other installed models

# Agent config & history paths
CONFIG_PATH = Path("agents/video_director/config.json")
HISTORY_PATH = Path("agents/video_director/history.json")

def query_ollama(prompt, system_prompt=""):
    """Queries the local Ollama API and returns the generated text response."""
    data = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "system": system_prompt,
        "stream": False
    }
    
    req = urllib.request.Request(
        OLLAMA_URL,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data.get("response", "").strip()
    except Exception as e:
        print(f"Ollama API 호출 실패: {e}", file=sys.stderr)
        return ""

def load_agent_config():
    """Loads the agent's persona configuration."""
    if not CONFIG_PATH.exists():
        print(f"Error: Agent config not found at {CONFIG_PATH}", file=sys.stderr)
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_history(entry):
    """Appends an execution record to the agent's history/memory file."""
    history = []
    if HISTORY_PATH.exists():
        try:
            with open(HISTORY_PATH, "r", encoding="utf-8") as f:
                history = json.load(f)
        except Exception:
            pass
            
    history.append(entry)
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

def main():
    global OLLAMA_MODEL
    parser = argparse.ArgumentParser(description="가족 미디어 디렉터 에이전트 영우 실행기")
    parser.add_argument("--task", type=str, required=True, help="기획서 또는 영상/이미지 요구사항 설명 (예: '코지한 겨울 오두막')")
    parser.add_argument("--mode", type=str, choices=["t2v", "i2v", "t2i"], default="t2i", help="생성 모드: t2v(비디오), i2v(이미지->비디오), t2i(이미지)")
    parser.add_argument("--image", type=str, default=None, help="i2v 모드 시 사용할 입력 이미지 파일 경로")
    parser.add_argument("--audio", type=str, default=None, help="결합할 로컬 배경 음원 파일 경로")
    parser.add_argument("--auto", action="store_true", help="승인 확인 절차 없이 즉시 생성을 실행합니다.")
    parser.add_argument("--model", type=str, default=OLLAMA_MODEL, help="사용할 Ollama 모델명")
    
    args = parser.parse_args()
    
    OLLAMA_MODEL = args.model
    
    # 1. Load config
    config = load_agent_config()
    print(f"\n[🎬 에이전트 활성화] 이름: {config['name']} | 역할: {config['role']}")
    
    # 2. Generate optimized prompt using Ollama based on mode
    print(f"\n1단계: 요구사항을 분석하여 {args.mode.upper()} 프롬프트를 기획합니다...")
    if args.mode == "t2i":
        analysis_prompt = (
            f"[Mode: T2I]\n"
            f"요구사항: '{args.task}'\n"
            f"Z-Image-Turbo용 실사 지향 영문 이미지 프롬프트를 출력하십시오."
        )
    elif args.mode == "t2v":
        analysis_prompt = (
            f"[Mode: T2V]\n"
            f"요구사항: '{args.task}'\n"
            f"LTX-Video 2.3용 시네마틱 카메라 워킹과 빛 묘사가 포함된 1단락 영문 비디오 프롬프트를 출력하십시오."
        )
    else:  # i2v
        analysis_prompt = (
            f"[Mode: I2V]\n"
            f"요구사항: '{args.task}'\n"
            f"LTX-Video 2.3용 이미지 시작 비디오용 프롬프트. 정적 묘사는 빼고 오직 움직임과 카메라 변화만 포함된 영문 프롬프트를 출력하십시오."
        )
    
    generated_prompt = query_ollama(analysis_prompt, system_prompt=config["system_prompt"])
    if not generated_prompt:
        print("기획 프롬프트 생성에 실패했습니다.", file=sys.stderr)
        sys.exit(1)
        
    print(f"\n[기획된 영문 프롬프트]:\n  -> \"{generated_prompt}\"")
    
    # 3. Confirmation Gate (Unless --auto is specified)
    if not args.auto:
        print("\n위 프롬프트로 미디어 생성을 진행할까요? (y/n): ", end="")
        choice = input().strip().lower()
        if choice != "y":
            print("생성이 취소되었습니다.")
            sys.exit(0)
            
    # 4. Generate via ComfyUI (main.py)
    print(f"\n2단계: ComfyUI 워크플로우를 실행하여 미디어를 렌더링합니다...")
    seed = random.randint(1, 100000000)
    
    # Run the workflow
    # Temporarily redirect output to capture ComfyUI output filename
    import io
    old_stdout = sys.stdout
    new_stdout = io.StringIO()
    sys.stdout = new_stdout
    
    success = run_workflow(
        prompt_text=generated_prompt,
        mode=args.mode,
        input_image=args.image,
        input_audio=args.audio,
        seed=seed
    )
    
    sys.stdout = old_stdout
    stdout_output = new_stdout.getvalue()
    print(stdout_output)
    
    if not success:
        print("렌더링에 실패했습니다.", file=sys.stderr)
        sys.exit(1)
        
    # Extract output files from stdout
    saved_files = []
    for line in stdout_output.split("\n"):
        if line.strip().startswith("OUTPUT_FILES: "):
            saved_files = [f.strip() for f in line.replace("OUTPUT_FILES: ", "").split(",") if f.strip()]
            
    output_file_str = saved_files[0] if saved_files else "알 수 없음 (D:\\가족\\output\\ 확인)"
    
    # 5. Evaluate the generated result using Ollama (Critic)
    print(f"\n3단계: 생성된 결과 미디어를 모니터링하고 평가합니다...")
    eval_query = (
        f"의도된 작업: {args.task}\n"
        f"기획된 프롬프트: {generated_prompt}\n"
        f"생성 모드: {args.mode.upper()}\n"
        f"저장된 파일: {output_file_str}\n\n"
        f"위 결과를 바탕으로 에이전트의 1줄 총평을 포함한 간단 평가 보고서를 작성해 주세요."
    )
    
    evaluation_report = query_ollama(eval_query, system_prompt=config["eval_prompt"])
    
    # Print the report
    print("\n==================================================")
    print("### 🎬 [영우의 미디어 디렉팅 및 평가 보고서]")
    print("==================================================")
    print(evaluation_report)
    print("==================================================")
    
    # 6. Save history (Agent Memory)
    save_history({
        "task": args.task,
        "mode": args.mode,
        "prompt": generated_prompt,
        "seed": seed,
        "image": args.image,
        "audio": args.audio,
        "output_file": output_file_str,
        "evaluation": evaluation_report
    })
    print("\n[✓] 디렉터 에이전트의 기억(history.json)에 기록이 추가되었습니다.")

if __name__ == "__main__":
    main()
