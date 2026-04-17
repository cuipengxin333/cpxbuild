<template>
  <div class="tool-container">
    <div class="tool-header">
      <h3>JSON 格式化 / 压缩 / 转义</h3>
      <div class="actions">
        <button class="tool-btn" @click="formatJSON">格式化</button>
        <button class="tool-btn" @click="minifyJSON">压缩</button>
        <button class="tool-btn" @click="escapeJSON">转义</button>
        <button class="tool-btn" @click="unescapeJSON">去转义</button>
        <button class="tool-btn clear" @click="input = ''">清空</button>
      </div>
    </div>
    <div class="tool-body">
      <textarea 
        v-model="input" 
        class="tool-textarea" 
        placeholder="在此输入或粘贴 JSON 内容..."
      ></textarea>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const input = ref('');
const error = ref('');

const formatJSON = () => {
  try {
    if (!input.value) return;
    const obj = JSON.parse(input.value);
    input.value = JSON.stringify(obj, null, 2);
    error.value = '';
  } catch (e: any) {
    error.value = '无效的 JSON 格式: ' + e.message;
  }
};

const minifyJSON = () => {
  try {
    if (!input.value) return;
    const obj = JSON.parse(input.value);
    input.value = JSON.stringify(obj);
    error.value = '';
  } catch (e: any) {
    error.value = '无效的 JSON 格式: ' + e.message;
  }
};

const escapeJSON = () => {
  if (!input.value) return;
  input.value = JSON.stringify(input.value).slice(1, -1);
};

const unescapeJSON = () => {
  if (!input.value) return;
  try {
    input.value = JSON.parse('"' + input.value + '"');
  } catch (e) {
    error.value = '去转义失败';
  }
};
</script>

<style scoped lang="scss">
.tool-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  h3 {
    margin: 0;
    color: var(--text-primary);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
}

.tool-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 400px;
}

.tool-textarea {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: monospace;
  font-size: 0.9rem;
  resize: none;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.tool-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &.clear {
    &:hover {
      border-color: #ef4444;
      color: #ef4444;
    }
  }
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 0.4rem;
}
</style>
