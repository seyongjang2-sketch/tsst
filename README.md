# ComfyUI API Control & WebSocket Progress Tracker (Python)

이 프로젝트는 ComfyUI의 API 기능을 사용하여 파이썬 코드로 워크플로우를 동적으로 제어하고, 웹소켓(WebSocket)을 통해 실시간 진행 상황을 모니터링하여 최종 결과 비디오/이미지를 자동으로 다운로드하는 템플릿입니다.

## 📁 파일 구조

- `comfy_api.py`: ComfyUI HTTP API 및 WebSocket 통신을 관리하는 모듈 (`ComfyAPI` 클래스 제공)
- `main.py`: `d:\Ltx2_3_i2v_GGUF.json` 워크플로우 템플릿을 읽고, 프롬프트/시드를 임의로 변경하여 큐를 실행하고 저장하는 엔트리 포인트
- `requirements.txt`: 프로젝트 의존성 라이브러리 목록

---

## 🛠️ 준비 사항

1. **ComfyUI 실행**: 로컬 머신에서 ComfyUI 서버가 정상적으로 실행 중이어야 합니다. (기본 주소: `http://127.0.0.1:8188`)
2. **API용 JSON 파일 준비**: 
   - 웹 브라우저로 ComfyUI 접속 후 **설정(톱니바퀴) -> Enable Dev mode** 활성화.
   - **Save (API Format)** 버튼을 눌러 JSON 파일을 저장합니다.
   - 본 프로젝트의 `main.py`는 기본적으로 `d:\Ltx2_3_i2v_GGUF.json` 경로의 템플릿을 타겟으로 실행하도록 세팅되어 있습니다.

---

## 🚀 설치 및 실행 방법

### 1. 의존성 패키지 설치
터미널에서 아래 명령을 실행하여 필요한 라이브러리를 설치합니다.
```bash
pip install -r requirements.txt
```

### 2. 스크립트 실행
아래 명령으로 스크립트를 실행하여 생성 테스트를 진행합니다.
```bash
python main.py
```

---

## 💡 주요 동작 매커니즘

1. **템플릿 JSON 로드**: `d:\Ltx2_3_i2v_GGUF.json` 파일을 파이썬 사전 객체로 로드합니다.
2. **동적 파라미터 주입**: 프롬프트 노드(`263`번)의 입력 텍스트와 시드 노드(`199`번)의 노이즈 시드값을 파이썬 코드로 동적 변경합니다.
3. **웹소켓(WebSocket) 활성화**: ComfyUI 실시간 진행 사항 채널인 `/ws`에 고유 클라이언트 ID로 웹소켓을 연결합니다.
4. **Queue 제출**: 수정된 JSON 워크플로우 데이터를 `http://127.0.0.1:8188/prompt` API로 전송합니다.
5. **실시간 모니터링**: 웹소켓으로부터 실시간 수신받는 `progress` 및 `executing` 이벤트를 바탕으로 터미널 콘솔에 진행률(%)과 현재 실행 노드를 보여줍니다.
6. **결과 다운로드**: 작업 완료(`executed`) 상태를 감지하면, 서버로부터 직접 결과 이미지를 다운로드하여 로컬 `./output` 폴더에 저장합니다.
