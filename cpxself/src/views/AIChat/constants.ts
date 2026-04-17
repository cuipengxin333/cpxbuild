export const availableModels = [
  "google/gemma-3-27b",
  "qwen/qwen2.5-7b",
  "qwen/qwen3-8b",
  "zhipu/glm-4-flash",
  "zhipu/glm-4v-flash",
  "zhipu/glm-4.1v-thinking-flash",
  "openai/gpt-oss-20b",
];

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  time: string;
  isError?: boolean;
}

export interface Suggestion {
  icon: string;
  label: string;
  prompt: string;
}

export const chatSuggestions: Suggestion[] = [
  {
    icon: "💡",
    label: "写一段代码",
    prompt: "请帮我写一段 Vue 3 使用 Composition API 的计数器代码，要求带上样式。"
  },
  {
    icon: "📝",
    label: "周报润色",
    prompt: "我这周完成了 AI 对话界面的重构和下拉框优化，请帮我润色成专业的周报内容。"
  },
  {
    icon: "🧠",
    label: "解释概念",
    prompt: "请用通俗易懂的语言解释一下什么是 SSE (Server-Sent Events) 以及它在 AI 对话中的作用。"
  },
  {
    icon: "🎨",
    label: "设计建议",
    prompt: "如何设计一个既美观又实用的 Web 应用侧边栏？请给出一些 UI/UX 方面的建议。"
  }
];
