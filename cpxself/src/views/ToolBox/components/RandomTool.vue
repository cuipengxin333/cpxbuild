<template>
  <div class="tool-container">
    <div class="tool-header">
      <h3>随机生成器 (字符串 / UUID / 密码)</h3>
      <div class="actions">
        <button class="tool-btn clear" @click="clear">清空</button>
      </div>
    </div>
    
    <div class="tool-grid">
      <div class="tool-item">
        <label>随机字符串生成</label>
        <div class="config-row">
          <input v-model.number="strLen" type="number" class="tool-input small" placeholder="长度">
          <div class="checkbox-group">
            <label><input v-model="strConfig.upper" type="checkbox"> A-Z</label>
            <label><input v-model="strConfig.lower" type="checkbox"> a-z</label>
            <label><input v-model="strConfig.number" type="checkbox"> 0-9</label>
            <label><input v-model="strConfig.special" type="checkbox"> !@#</label>
          </div>
          <button class="tool-btn generate" @click="genStr">生成</button>
        </div>
      </div>

      <div class="tool-item">
        <label>UUID 生成</label>
        <div class="config-row">
          <button class="tool-btn generate" @click="genUUID">生成 UUID</button>
          <button class="tool-btn generate" @click="genUUIDV4">生成 v4</button>
        </div>
      </div>
    </div>

    <div class="tool-result">
      <div v-for="(res, i) in results" :key="i" class="result-item">
        <span class="value">{{ res }}</span>
        <button class="tool-btn small" @click="copy(res)">复制</button>
      </div>
      <div v-if="results.length === 0" class="no-result">结果将在此显示...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';

const { appContext } = getCurrentInstance()!;
const results = ref<string[]>([]);
const strLen = ref(16);
const strConfig = reactive({
  upper: true,
  lower: true,
  number: true,
  special: false
});

const genStr = () => {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let pool = '';
  if (strConfig.upper) pool += upperChars;
  if (strConfig.lower) pool += lowerChars;
  if (strConfig.number) pool += numberChars;
  if (strConfig.special) pool += specialChars;

  if (!pool) {
    appContext.config.globalProperties.$toast?.({ message: '请选择字符范围', type: 'warning' });
    return;
  }

  let res = '';
  for (let i = 0; i < strLen.value; i++) {
    res += pool.charAt(Math.floor(Math.random() * pool.length));
  }
  results.value.unshift(res);
  if (results.value.length > 10) results.value.pop();
};

const genUUID = () => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  results.value.unshift(uuid);
};

const genUUIDV4 = () => {
  results.value.unshift(crypto.randomUUID());
};

const copy = (text: string) => {
  navigator.clipboard.writeText(text);
  appContext.config.globalProperties.$toast?.({ message: '复制成功', type: 'success' });
};

const clear = () => {
  results.value = [];
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
  grid-template-columns: 1fr;
  gap: 1.5rem;
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

.config-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-group {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);

  label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }
}

.tool-input {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.95rem;

  &.small {
    width: 80px;
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.tool-result {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  min-height: 100px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.4rem;
  border: 1px solid var(--border-color);

  .value {
    font-family: monospace;
    font-size: 0.95rem;
    color: var(--primary-color);
    word-break: break-all;
  }
}

.no-result {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding-top: 1rem;
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

  &.generate {
    background: var(--primary-color);
    color: white;
    border: none;
    font-weight: 600;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }

  &.small {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  &.clear {
    &:hover {
      border-color: #ef4444;
      color: #ef4444;
    }
  }
}
</style>
