<template>
  <div class="chat-footer">
    <div class="input-wrapper">
      <textarea :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        class="chat-input" placeholder="输入您的问题..." @keydown.enter.prevent="$emit('send')"
        :disabled="isLoading"></textarea>
      <button class="send-btn" @click="$emit('send')" :disabled="!modelValue.trim() || isLoading">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  isLoading: boolean;
}>();

defineEmits(["update:modelValue", "send"]);
</script>

<style scoped lang="scss">
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
  height: 45px;
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
</style>
