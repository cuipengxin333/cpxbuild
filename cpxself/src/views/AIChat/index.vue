<template>
  <div class="chat-container">
    <div class="chat-card">
      <ChatHeader v-model="selectedModel" :isLoading="isLoading" ref="headerRef" />

      <ChatMessageList ref="messageListRef" :chatHistory="chatHistory" :isLoading="isLoading" @retry="onRetry"
        @focus-selector="focusModelSelector" @suggestion-click="handleSuggestionClick" />

      <ChatFooter v-model="message" :isLoading="isLoading" @send="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
} from "vue";
import ChatHeader from "./components/ChatHeader.vue";
import ChatMessageList from "./components/ChatMessageList.vue";
import ChatFooter from "./components/ChatFooter.vue";
import { useChat } from "./hooks/useChat";

const {
  message,
  isLoading,
  selectedModel,
  chatHistory,
  sendMessage,
  handleRetry
} = useChat();

const messageListRef = ref<InstanceType<typeof ChatMessageList> | null>(null);

const scrollToBottom = () => {
  messageListRef.value?.scrollToBottom();
};

const focusModelSelector = () => {
  const select = document.querySelector('.model-select') as HTMLSelectElement;
  select?.focus();
};

const handleSendMessage = () => {
  sendMessage(scrollToBottom);
};

const onRetry = (index: number) => {
  handleRetry(index, scrollToBottom);
};

const handleSuggestionClick = (prompt: string) => {
  message.value = prompt;
  handleSendMessage();
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
  height: calc(100vh - var(--nav-height) - 4rem);
  overflow: hidden;
}

@media (max-width: 768px) {
  .chat-card {
    height: calc(100vh - var(--nav-height) - 4rem);
  }
}
</style>
