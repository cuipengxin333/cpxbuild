<template>
  <div class="chat-messages" ref="messageListRef">
    <template v-if="chatHistory.length > 0">
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
          <div class="message-time">{{ msg.time }}</div>
          <div v-if="msg.isError" class="error-actions">
            <button class="action-btn" @click="$emit('retry', index)">重试</button>
            <button class="action-btn" @click="$emit('focus-selector')">切换模型</button>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <div class="welcome-section">
        <div class="welcome-icon">🤖</div>
        <h2 class="welcome-title">有什么可以帮你吗？</h2>
        <p class="welcome-desc">我是您的 AI 助手，您可以尝试询问我以下问题：</p>
      </div>

      <div class="suggestions-grid">
        <div
          v-for="(item, idx) in chatSuggestions"
          :key="idx"
          class="suggestion-card"
          @click="$emit('suggestion-click', item.prompt)"
        >
          <span class="suggestion-icon">{{ item.icon }}</span>
          <span class="suggestion-label">{{ item.label }}</span>
          <div class="suggestion-arrow">→</div>
        </div>
      </div>
    </div>

    <div
      v-if="isLoading && chatHistory[chatHistory.length - 1]?.role !== 'assistant'"
      class="message-item assistant"
    >
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
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { type ChatMessage, chatSuggestions } from '../constants';

const props = defineProps<{
  chatHistory: ChatMessage[];
  isLoading: boolean;
}>();

defineEmits(['retry', 'focus-selector', 'suggestion-click']);

const messageListRef = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

// 监听历史记录变化自动滚动
watch(() => props.chatHistory, () => {
  scrollToBottom();
}, { deep: true });

// 暴露给父组件
defineExpose({ scrollToBottom });
</script>

<style scoped lang="scss">
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

  .message-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

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

    .message-time {
      font-size: 0.75rem;
      color: var(--text-secondary);
      opacity: 0.7;
      margin-top: 0.2rem;
    }

    .error-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.75rem;

      .action-btn {
        padding: 0.35rem 1rem;
        font-size: 0.8rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          background: rgba(var(--primary-color-rgb), 0.05);
        }
      }
    }
  }

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
    }

    .message-bubble {
      background: var(--primary-color);
      color: #fff;
      border-radius: 1.25rem 0.25rem 1.25rem 1.25rem;
    }
  }

  &.assistant {
    align-self: flex-start;

    .message-content {
      align-items: flex-start;
    }

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
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .welcome-section {
    margin-bottom: 2.5rem;
    animation: fadeInDown 0.8s ease;

    .welcome-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 20px rgba(var(--primary-color-rgb), 0.3));
    }

    .welcome-title {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .welcome-desc {
      color: var(--text-secondary);
      font-size: 1rem;
      opacity: 0.8;
    }
  }

  .suggestions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 600px;
    animation: fadeInUp 0.8s ease 0.2s both;
  }

  .suggestion-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    display: flex;
    padding: 0.5rem;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    &:hover {
      border-color: var(--primary-color);
      background: var(--bg-secondary);
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(var(--primary-color-rgb), 0.1);

      .suggestion-arrow {
        transform: translateX(4px);
        opacity: 1;
      }

      .suggestion-icon {
        transform: scale(1.2) rotate(10deg);
      }
    }

    .suggestion-icon {
      font-size: 1.25rem;
      transition: transform 0.3s ease;
    }

    .suggestion-label {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
      flex: 1;
      text-align: left;
    }

    .suggestion-arrow {
      font-size: 1.2rem;
      color: var(--primary-color);
      opacity: 0;
      transition: all 0.3s ease;
    }
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

@media (max-width: 768px) {
  .message-item {
    max-width: 90%;
  }
}
</style>
