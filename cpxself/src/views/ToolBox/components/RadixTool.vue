<template>
  <div class="tool-container">
    <div class="tool-header">
      <h3>进制转换 (二/十/十六/ASCII)</h3>
      <div class="actions">
        <button class="tool-btn clear" @click="clear">清空</button>
      </div>
    </div>
    
    <div class="tool-grid">
      <div v-for="item in systems" :key="item.base" class="tool-item">
        <label>{{ item.name }} (Base {{ item.base }})</label>
        <div class="input-group">
          <input 
            v-model="values[item.key]" 
            type="text" 
            class="tool-input" 
            :placeholder="'输入' + item.name + '数值...'"
            @input="convert(item.key, item.base)"
          >
          <button class="tool-btn small" @click="copy(values[item.key])">复制</button>
        </div>
      </div>
      
      <div class="tool-item">
        <label>ASCII 文本</label>
        <div class="input-group">
          <input 
            v-model="values.ascii" 
            type="text" 
            class="tool-input" 
            placeholder="输入 ASCII 文本..."
            @input="convertFromAscii"
          >
          <button class="tool-btn small" @click="copy(values.ascii)">复制</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance } from 'vue';

const { appContext } = getCurrentInstance()!;
const values = reactive<Record<string, string>>({
  bin: '',
  oct: '',
  dec: '',
  hex: '',
  ascii: ''
});

const systems = [
  { name: '二进制', base: 2, key: 'bin' },
  { name: '八进制', base: 8, key: 'oct' },
  { name: '十进制', base: 10, key: 'dec' },
  { name: '十六进制', base: 16, key: 'hex' }
];

const convert = (key: string, base: number) => {
  const inputVal = values[key].trim();
  if (!inputVal) {
    clear();
    return;
  }

  try {
    const decimalValue = parseInt(inputVal, base);
    if (isNaN(decimalValue)) return;

    values.bin = decimalValue.toString(2);
    values.oct = decimalValue.toString(8);
    values.dec = decimalValue.toString(10);
    values.hex = decimalValue.toString(16).toUpperCase();
    values.ascii = String.fromCharCode(decimalValue);
  } catch (e) {
    // 忽略错误
  }
};

const convertFromAscii = () => {
  if (!values.ascii) {
    clear();
    return;
  }
  const code = values.ascii.charCodeAt(0);
  values.bin = code.toString(2);
  values.oct = code.toString(8);
  values.dec = code.toString(10);
  values.hex = code.toString(16).toUpperCase();
};

const copy = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  appContext.config.globalProperties.$toast?.({ message: '复制成功', type: 'success' });
};

const clear = () => {
  values.bin = '';
  values.oct = '';
  values.dec = '';
  values.hex = '';
  values.ascii = '';
};
</script>

<style scoped lang="scss">
.tool-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}

.tool-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 600;
  }
}

.input-group {
  display: flex;
  gap: 0.75rem;
}

.tool-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: monospace;

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

  &.small {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
    background: var(--primary-color);
    color: white;
    border: none;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }

  &.clear {
    &:hover {
      border-color: #ef4444;
      color: #ef4444;
    }
  }
}
</style>
