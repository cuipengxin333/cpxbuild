<template>
  <div class="chat-container">
    <div class="chat-card">
      <div class="chat-header">
        <div class="header-main">
          <h1 class="chat-title">AI 智能对话</h1>
          <div class="model-selector-wrapper">
            <select
              v-model="selectedModel"
              class="model-select"
              :disabled="isLoading"
            >
              <optgroup
                v-for="(models, group) in groupedModels"
                :key="group"
                :label="group"
              >
                <option v-for="m in models" :key="m" :value="m">
                  {{ m.split("/")[1] }}
                </option>
              </optgroup>
            </select>
            <div class="select-arrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <p class="chat-desc">正在使用: {{ selectedModel }}</p>
      </div>

      <div class="chat-messages" ref="messageListRef">
        <div
          v-for="(msg, index) in chatHistory"
          :key="index"
          class="message-item"
          :class="msg.role"
        >
          <div class="message-avatar">
            {{ msg.role === "user" ? "👤" : "🤖" }}
          </div>
          <div class="message-content">
            <div class="message-bubble">
              {{ msg.content }}
            </div>
          </div>
        </div>
        <div v-if="isLoading && chatHistory[chatHistory.length - 1]?.role !== 'assistant'" class="message-item assistant">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="message-bubble loading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-footer">
        <div class="input-wrapper">
          <textarea
            v-model="message"
            class="chat-input"
            placeholder="输入您的问题..."
            @keydown.enter.prevent="sendMessage"
            :disabled="isLoading"
          ></textarea>
          <button
            class="send-btn"
            @click="sendMessage"
            :disabled="!message.trim() || isLoading"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {
  ref,
  reactive,
  nextTick,
  onMounted,
  computed,
  onBeforeUnmount,
} from "vue";
import { createTypewriter } from "element-ai-vue";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const message = ref("");
const isLoading = ref(false);
const messageListRef = ref<HTMLElement | null>(null);
const chatHistory = reactive<ChatMessage[]>([]);

// 初始化打字机
const typewriter = createTypewriter({
  interval: 50, // 调整打字速度，让流式感更强
});

onBeforeUnmount(() => {
  typewriter.destory();
});

// 模型列表配置
const availableModels = [
  "deepseek/deepseek-r1-0528",
  "deepseek/deepseek-v3-0324",
  "google/gemini-2.0-flash-exp",
  "google/gemma-3-27b",
  "qwen/qwen2.5-7b",
  "qwen/qwen2.5-72b",
  "qwen/qwen2.5-vl-32b",
  "qwen/qwen3-8b",
  "qwen/qwen3-30b-a3b",
  "qwen/qwen3-14b",
  "qwen/qwen3-coder",
  "zhipu/glm-4-9b",
  "zhipu/glm-4-flash",
  "zhipu/glm-4v-flash",
  "zhipu/glm-4.1v-thinking-flash",
  "zhipu/glm-4.5-flash",
  "zhipu/glm-4.6v-flash",
  "openai/gpt-oss-20b",
  "xiaomi/mimo-v2-flash",
];

const selectedModel = ref("qwen/qwen2.5-7b");

// 按厂商对模型进行分组展示
const groupedModels = computed(() => {
  const groups: Record<string, string[]> = {};
  availableModels.forEach((model) => {
    const [vendor] = model.split("/");
    if (!groups[vendor]) groups[vendor] = [];
    groups[vendor].push(model);
  });
  return groups;
});

const scrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return;

  const userContent = message.value.trim();
  chatHistory.push({ role: "user", content: userContent });
  message.value = "";
  isLoading.value = true;
  await scrollToBottom();

  let assistantMessageIndex = -1;

  try {
    const response = await fetch(
      "https://platform.aitools.cfd/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer sk-020fb7eb11634ce681e1388c1f88fb74",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel.value,
          messages: [{ role: "user", content: userContent }],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `请求失败: ${response.status}`
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("无法读取响应流");

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      // 处理 SSE 数据格式
      const lines = chunkValue.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.replace("data: ", "").trim();

          if (dataStr === "[DONE]") {
            done = true;
            break;
          }

          try {
            const data = JSON.parse(dataStr);
            const content = data.choices[0]?.delta?.content || "";
            if (content) {
              // 收到第一个有效内容时，才创建助手消息占位并开始打字机
              if (assistantMessageIndex === -1) {
                chatHistory.push({ role: "assistant", content: "", isError: false });
                assistantMessageIndex = chatHistory.length - 1;

                typewriter.stop();
                typewriter.setText("");
                typewriter.start((text: string) => {
                  chatHistory[assistantMessageIndex].content = text;
                  scrollToBottom();
                });
              }
              
              // 将获取到的流内容喂给打字机
              typewriter.addText(content);
            }
          } catch (e) {
            console.error("解析 SSE 数据出错", e);
          }
        }
      }
    }
  } catch (error: any) {
    console.error("发送失败:", error);
    let errorMsg = "抱歉，我现在无法回答您。";

    if (error.message) {
      errorMsg = `错误: ${error.message}`;
    }

    typewriter.stop();
    
    if (assistantMessageIndex === -1) {
      chatHistory.push({ role: "assistant", content: errorMsg, isError: true });
    } else {
      chatHistory[assistantMessageIndex].content = errorMsg;
      chatHistory[assistantMessageIndex].isError = true;
    }
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

onMounted(() => {
  document.title = "AI Chat - 八爪鱼";
});
</script>

<style scoped lang="scss">
.chat-container {
  padding: 2rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}

.chat-card {
  background: var(--card-bg);
  border-radius: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  height: 700px;
  overflow: hidden;
}

.chat-header {
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(var(--bg-primary-rgb), 0.5);

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .model-selector-wrapper {
    position: relative;
    width: 280px;

    .model-select {
      width: 100%;
      padding: 0.5rem 2.5rem 0.5rem 1rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      appearance: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &:hover:not(:disabled) {
        border-color: var(--primary-color);
        background: var(--bg-secondary);
      }

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      optgroup {
        background: var(--bg-primary);
        font-weight: bold;
        color: var(--text-secondary);
      }

      option {
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 0.5rem;
      }
    }

    .select-arrow {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--text-secondary);
      display: flex;

      svg {
        width: 1rem;
        height: 1rem;
      }
    }
  }

  .chat-title {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--accent-color)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .chat-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    opacity: 0.8;
  }
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
}

.message-item {
  display: flex;
  gap: 1rem;
  max-width: 85%;

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-bubble {
      background: var(--primary-color);
      color: #fff;
      border-radius: 1.25rem 0.25rem 1.25rem 1.25rem;
    }
  }

  &.assistant {
    align-self: flex-start;

    .message-bubble {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-radius: 0.25rem 1.25rem 1.25rem 1.25rem;
    }
  }

  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .message-bubble {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
    line-height: 1.6;
    word-break: break-all;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    &.loading {
      display: flex;
      gap: 4px;
      padding: 1rem;

      .dot {
        width: 6px;
        height: 6px;
        background: var(--text-secondary);
        border-radius: 50%;
        animation: loadingDot 1.4s infinite ease-in-out;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
}

.chat-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  background: rgba(var(--bg-primary-rgb), 0.5);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.chat-input {
  flex: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  color: var(--text-primary);
  font-size: 0.95rem;
  resize: none;
  height: 50px;
  max-height: 150px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) rotate(-5deg);
    box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3);
  }

  &:disabled {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: not-allowed;
  }
}

@keyframes loadingDot {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

@media (max-width: 768px) {
  .chat-card {
    height: calc(100vh - var(--nav-height) - 4rem);
  }

  .message-item {
    max-width: 90%;
  }
}
</style>
