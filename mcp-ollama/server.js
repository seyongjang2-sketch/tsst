#!/usr/bin/env node
/**
 * MCP Server — Ollama Gemma4 + ComfyUI
 * Antigravity에서 로컬 Gemma4 및 ComfyUI LTX-Video 생성을 사용하기 위한 MCP 서버
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ─── 설정 ───────────────────────────────────────────────────────────────────
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const DEFAULT_MODEL   = process.env.OLLAMA_MODEL || "gemma4:latest";  // 설치된 모델명
const DEFAULT_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT || "300000"); // 5분

// ─── Ollama API 호출 유틸 ────────────────────────────────────────────────────
async function ollamaGenerate({ model, prompt, system, stream = false }) {
  const url = `${OLLAMA_BASE_URL}/api/generate`;
  const body = JSON.stringify({ model, prompt, system, stream });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama HTTP ${res.status}: ${errText}`);
    }

    const json = await res.json();
    return json.response ?? "";
  } finally {
    clearTimeout(timer);
  }
}

async function ollamaChat({ model, messages, stream = false }) {
  const url = `${OLLAMA_BASE_URL}/api/chat`;
  const body = JSON.stringify({ model, messages, stream });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama HTTP ${res.status}: ${errText}`);
    }

    const json = await res.json();
    return json.message?.content ?? "";
  } finally {
    clearTimeout(timer);
  }
}

async function ollamaListModels() {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
  if (!res.ok) throw new Error(`Ollama 연결 실패: HTTP ${res.status}`);
  const json = await res.json();
  return (json.models || []).map((m) => m.name);
}

// ─── MCP 서버 생성 ───────────────────────────────────────────────────────────
const server = new Server(
  { name: "mcp-ollama-gemma4", version: "1.1.0" },
  { capabilities: { tools: {} } }
);

// ─── 도구 목록 정의 ──────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "ask_gemma4",
      description:
        "로컬 Ollama에서 실행 중인 Gemma4 모델에게 질문합니다. 코드 생성, 번역, 분석, 요약 등 다양한 작업에 사용하세요.",
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Gemma4에게 보낼 질문 또는 지시사항",
          },
          system: {
            type: "string",
            description:
              "(선택) 시스템 프롬프트 — Gemma4의 역할이나 행동 방식을 지정합니다. 예: '당신은 한국어 번역 전문가입니다.'",
          },
          model: {
            type: "string",
            description:
              "(선택) 사용할 Ollama 모델 이름. 기본값: gemma3:4b. 예: gemma3:12b, gemma3:27b",
          },
        },
        required: ["prompt"],
      },
    },
    {
      name: "chat_gemma4",
      description:
        "Gemma4와 멀티턴 대화를 합니다. 이전 대화 맥락을 유지한 채 응답을 받습니다.",
      inputSchema: {
        type: "object",
        properties: {
          messages: {
            type: "array",
            description:
              "대화 메시지 배열. 각 메시지는 {role: 'user'|'assistant'|'system', content: '...'} 형식",
            items: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                  enum: ["user", "assistant", "system"],
                },
                content: { type: "string" },
              },
              required: ["role", "content"],
            },
          },
          model: {
            type: "string",
            description: "(선택) 사용할 모델. 기본값: gemma3:4b",
          },
        },
        required: ["messages"],
      },
    },
    {
      name: "list_ollama_models",
      description:
        "현재 Ollama에 설치된 모델 목록을 반환합니다. 사용 가능한 모델을 확인할 때 사용하세요.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "check_ollama_status",
      description:
        "Ollama 서버가 정상적으로 실행 중인지 확인합니다. 연결 문제 진단에 사용하세요.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "generate_ltx_video",
      description:
        "ComfyUI를 사용하여 LTX-Video 2.3 GGUF 비디오 생성을 실행합니다. 텍스트로 비디오를 만드는 T2V 모드와 이미지로부터 비디오를 만드는 I2V 모드를 지원합니다.",
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "비디오를 생성하기 위한 긍정 프롬프트 (영어)"
          },
          mode: {
            type: "string",
            enum: ["t2v", "i2v"],
            description: "생성 모드: t2v(Text-to-Video) 또는 i2v(Image-to-Video). 기본값: t2v"
          },
          image: {
            type: "string",
            description: "i2v 모드 시 사용할 입력 이미지 파일의 전체 경로 (로컬 경로)"
          },
          audio: {
            type: "string",
            description: "(선택) 동영상에 결합할 배경 음원 파일의 전체 경로 (로컬 경로)"
          },
          seed: {
            type: "integer",
            description: "(선택) 생성 시드값"
          }
        },
        required: ["prompt"]
      }
    }
  ],
}));

// ─── 도구 실행 핸들러 ────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "ask_gemma4": {
        const { prompt, system, model = DEFAULT_MODEL } = args;
        console.error(`[ask_gemma4] 모델: ${model}, 프롬프트 길이: ${prompt.length}자`);
        const response = await ollamaGenerate({ model, prompt, system });
        return { content: [{ type: "text", text: response }] };
      }

      case "chat_gemma4": {
        const { messages, model = DEFAULT_MODEL } = args;
        console.error(`[chat_gemma4] 모델: ${model}, 메시지 수: ${messages.length}`);
        const response = await ollamaChat({ model, messages });
        return { content: [{ type: "text", text: response }] };
      }

      case "list_ollama_models": {
        const models = await ollamaListModels();
        const text =
          models.length > 0
            ? `설치된 Ollama 모델 목록 (${models.length}개):\n${models.map((m) => `  • ${m}`).join("\n")}`
            : "설치된 모델이 없습니다. `ollama pull gemma3:4b` 명령으로 모델을 받으세요.";
        return { content: [{ type: "text", text }] };
      }

      case "check_ollama_status": {
        try {
          const models = await ollamaListModels();
          const text = [
            `✅ Ollama 서버 정상 동작 중`,
            `📍 주소: ${OLLAMA_BASE_URL}`,
            `🧠 기본 모델: ${DEFAULT_MODEL}`,
            `📦 설치된 모델: ${models.length}개`,
            models.length > 0 ? `   ${models.join(", ")}` : "   (없음)",
          ].join("\n");
          return { content: [{ type: "text", text }] };
        } catch (err) {
          return {
            content: [
              {
                type: "text",
                text: [
                  `❌ Ollama 연결 실패`,
                  `📍 시도한 주소: ${OLLAMA_BASE_URL}`,
                  `⚠️  오류: ${err.message}`,
                  ``,
                  `해결 방법:`,
                  `  1. Ollama가 설치되어 있는지 확인: https://ollama.com`,
                  `  2. Ollama 실행: ollama serve`,
                  `  3. Gemma4 모델 다운로드: ollama pull gemma3:4b`,
                ].join("\n"),
              },
            ],
            isError: true,
          };
        }
      }

      case "generate_ltx_video": {
        const { prompt, mode = "t2v", image, audio, seed } = args;
        console.error(`[generate_ltx_video] 모드: ${mode}, 프롬프트: ${prompt}`);

        if (mode === "i2v" && !image) {
          throw new Error("i2v 모드에서는 image 파라미터가 필수입니다.");
        }

        // Build command to execute Python script in D:\가족\main.py
        let cmd = `python D:\\가족\\main.py --prompt "${prompt.replace(/"/g, '\\"')}" --mode ${mode}`;
        
        if (image) {
          cmd += ` --image "${image}"`;
        }
        if (audio) {
          cmd += ` --audio "${audio}"`;
        }
        if (seed !== undefined) {
          cmd += ` --seed ${seed}`;
        }

        const { exec } = await import("child_process");
        const util = await import("util");
        const execPromise = util.promisify(exec);

        try {
          const { stdout, stderr } = await execPromise(cmd);
          
          // Parse stdout to find OUTPUT_FILES
          const lines = stdout.split("\n");
          let files = [];
          for (const line of lines) {
            if (line.trim().startsWith("OUTPUT_FILES: ")) {
              files = line.replace("OUTPUT_FILES: ", "").trim().split(",");
            }
          }

          const responseText = [
            `✅ 비디오 생성 성공!`,
            `🎬 모드: ${mode.toUpperCase()}`,
            `📝 입력 프롬프트: ${prompt}`,
            files.length > 0 
              ? `📁 생성 완료된 파일 경로:\n${files.map(f => `   • ${f}`).join("\n")}` 
              : "⚠️  파일 정보를 가져오지 못했습니다. ComfyUI 폴더의 output을 확인해보세요.",
            `\n[상세 실행 로그]:\n${stdout}`
          ].join("\n");

          return {
            content: [{ type: "text", text: responseText }]
          };
        } catch (execErr) {
          return {
            content: [
              { 
                type: "text", 
                text: `❌ 비디오 생성 중 오류 발생:\n\n[실행 명령]: ${cmd}\n\n[오류 로그]:\n${execErr.stderr || execErr.message}\n\n[출력 로그]:\n${execErr.stdout}` 
              }
            ],
            isError: true
          };
        }
      }

      default:
        throw new Error(`알 수 없는 도구: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ 오류 발생: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// ─── 서버 시작 ───────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ MCP Ollama Gemma4 서버 시작됨 (stdio 모드)");
  console.error(`   Ollama URL: ${OLLAMA_BASE_URL}`);
  console.error(`   기본 모델: ${DEFAULT_MODEL}`);
}

main().catch((err) => {
  console.error("서버 시작 실패:", err);
  process.exit(1);
});
