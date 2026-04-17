import { ref, reactive, onBeforeUnmount } from 'vue';
import { createTypewriter } from 'element-ai-vue';
import type { ChatMessage } from '../constants';

export function useChat() {
  const message = ref("");
  const isLoading = ref(false);
  const selectedModel = ref("qwen/qwen2.5-7b");
  const chatHistory = reactive<ChatMessage[]>([]);

  // 用于存储当前正在运行的打字机实例
  let activeTypewriter: any = null;

  onBeforeUnmount(() => {
    if (activeTypewriter) {
      activeTypewriter.destory();
    }
  });

  // 格式化当前时间
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (onScrollToBottom: () => void) => {
    if (!message.value.trim() || isLoading.value) return;

    const userContent = message.value.trim();
    chatHistory.push({ role: "user", content: userContent, time: getCurrentTime() });
    message.value = "";
    isLoading.value = true;
    onScrollToBottom();

    let assistantMessageIndex = -1;
    let localTypewriter: any = null;

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
                  chatHistory.push({
                    role: "assistant",
                    content: "",
                    time: getCurrentTime(),
                    isError: false,
                  });
                  assistantMessageIndex = chatHistory.length - 1;

                  // 为每一条消息创建一个独立的打字机实例
                  localTypewriter = createTypewriter({
                    interval: 30,
                  });
                  activeTypewriter = localTypewriter;

                  localTypewriter.start((text: string) => {
                    if (assistantMessageIndex !== -1) {
                      chatHistory[assistantMessageIndex].content = text;
                      onScrollToBottom();
                    }
                  });
                }

                // 将获取到的流内容喂给当前消息的打字机
                localTypewriter.addText(content);
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

      if (localTypewriter) {
        localTypewriter.stop();
      }

      if (assistantMessageIndex === -1) {
        chatHistory.push({
          role: "assistant",
          content: errorMsg,
          time: getCurrentTime(),
          isError: true,
        });
      } else {
        chatHistory[assistantMessageIndex].content = errorMsg;
        chatHistory[assistantMessageIndex].time = getCurrentTime();
        chatHistory[assistantMessageIndex].isError = true;
      }
    } finally {
      isLoading.value = false;
      onScrollToBottom();
    }
  };

  const handleRetry = (index: number, onScrollToBottom: () => void) => {
    const lastUserMsg = [...chatHistory]
      .reverse()
      .find((m, i) => m.role === 'user' && i >= (chatHistory.length - 1 - index));
    
    if (lastUserMsg) {
      message.value = lastUserMsg.content;
      sendMessage(onScrollToBottom);
    }
  };

  return {
    message,
    isLoading,
    selectedModel,
    chatHistory,
    sendMessage,
    handleRetry
  };
}
