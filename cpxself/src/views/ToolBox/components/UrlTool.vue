<template>
  <div class="tool-container">
    <div class="tool-header">
      <h3>URL 编解码 / 参数解析</h3>
      <div class="actions">
        <button class="tool-btn" @click="encodeURL">编码</button>
        <button class="tool-btn" @click="decodeURL">解码</button>
        <button class="tool-btn" @click="parseParams">解析参数</button>
        <button class="tool-btn clear" @click="clear">清空</button>
      </div>
    </div>
    <div class="tool-body">
      <div class="input-section">
        <label>URL / 文本</label>
        <textarea 
          v-model="input" 
          class="tool-textarea" 
          placeholder="输入 URL 或文本..."
        ></textarea>
      </div>
      
      <div class="output-section">
        <label>结果 / 解析结果</label>
        <textarea 
          v-model="output" 
          class="tool-textarea readonly" 
          readonly 
          placeholder="结果将显示在此..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const input = ref('');
const output = ref('');

const encodeURL = () => {
  if (!input.value) return;
  output.value = encodeURIComponent(input.value);
};

const decodeURL = () => {
  if (!input.value) return;
  try {
    output.value = decodeURIComponent(input.value);
  } catch (e) {
    output.value = '解码失败: ' + e;
  }
};

const parseParams = () => {
  if (!input.value) return;
  try {
    const url = new URL(input.value.includes('?') ? input.value : '?' + input.value);
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    output.value = JSON.stringify(params, null, 2);
  } catch (e) {
    output.value = '参数解析失败';
  }
};

const clear = () => {
  input.value = '';
  output.value = '';
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
  gap: 1rem;

  h3 {
    margin: 0;
    color: var(--text-primary);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }
}

.tool-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 400px;
}

.input-section, .output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
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

  &.readonly {
    background: var(--bg-secondary);
    cursor: default;
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
</style>
