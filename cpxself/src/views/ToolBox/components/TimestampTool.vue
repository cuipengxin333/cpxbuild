<template>
  <div class="tool-container">
    <div class="tool-header">
      <h3>时间戳转换</h3>
      <div class="actions">
        <button class="tool-btn" @click="now">获取当前时间</button>
        <button class="tool-btn clear" @click="clear">清空</button>
      </div>
    </div>
    
    <div class="tool-grid">
      <div class="tool-item">
        <label>时间戳 (秒 / 毫秒)</label>
        <div class="input-group">
          <input 
            v-model="timestamp" 
            type="text" 
            class="tool-input" 
            placeholder="输入时间戳，如: 1713344400000"
            @input="tsToDate"
          >
          <button class="tool-btn small" @click="tsToDate">转为北京时间</button>
        </div>
      </div>
      
      <div class="tool-item">
        <label>北京时间 (YYYY-MM-DD HH:mm:ss)</label>
        <div class="input-group">
          <input 
            v-model="dateStr" 
            type="text" 
            class="tool-input" 
            placeholder="输入日期，如: 2024-04-17 12:00:00"
            @input="dateToTs"
          >
          <button class="tool-btn small" @click="dateToTs">转为时间戳</button>
        </div>
      </div>
    </div>

    <div class="tool-result">
      <div class="result-row">
        <span>北京时间 (UTC+8):</span>
        <span class="value">{{ resultDate || '-' }}</span>
      </div>
      <div class="result-row">
        <span>秒级时间戳 (s):</span>
        <span class="value">{{ resultTsSec || '-' }}</span>
      </div>
      <div class="result-row">
        <span>毫秒级时间戳 (ms):</span>
        <span class="value">{{ resultTsMs || '-' }}</span>
      </div>
      <div class="result-row">
        <span>当前时区:</span>
        <span class="value">{{ timezone || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const timestamp = ref('');
const dateStr = ref('');
const resultDate = ref('');
const resultTsSec = ref('');
const resultTsMs = ref('');
const timezone = ref('');

onMounted(() => {
  timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
});

const now = () => {
  const currentTs = Date.now();
  timestamp.value = currentTs.toString();
  tsToDate();
};

const tsToDate = () => {
  if (!timestamp.value) return;
  try {
    let ts = parseInt(timestamp.value);
    // 判断秒级还是毫秒级
    if (timestamp.value.length === 10) {
      ts *= 1000;
    }
    const d = new Date(ts);
    if (isNaN(d.getTime())) throw new Error();
    
    resultDate.value = d.toLocaleString('zh-CN', { hour12: false });
    resultTsSec.value = Math.floor(ts / 1000).toString();
    resultTsMs.value = ts.toString();
    dateStr.value = resultDate.value;
  } catch (e) {
    resultDate.value = '无效的时间戳';
  }
};

const dateToTs = () => {
  if (!dateStr.value) return;
  try {
    const d = new Date(dateStr.value);
    if (isNaN(d.getTime())) throw new Error();
    
    const ts = d.getTime();
    resultDate.value = d.toLocaleString('zh-CN', { hour12: false });
    resultTsSec.value = Math.floor(ts / 1000).toString();
    resultTsMs.value = ts.toString();
    timestamp.value = ts.toString();
  } catch (e) {
    resultDate.value = '无效的日期格式';
  }
};

const clear = () => {
  timestamp.value = '';
  dateStr.value = '';
  resultDate.value = '';
  resultTsSec.value = '';
  resultTsMs.value = '';
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

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.tool-result {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: var(--text-secondary);

  .value {
    color: var(--primary-color);
    font-weight: 700;
    font-family: monospace;
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
