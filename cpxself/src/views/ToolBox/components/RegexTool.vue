<template>
  <div class="tool-container">
    <div class="tool-header">
      <h3>正则表达式测试器</h3>
      <div class="actions">
        <button class="tool-btn clear" @click="clear">清空</button>
      </div>
    </div>
    
    <div class="tool-grid">
      <div class="tool-item">
        <label>正则表达式</label>
        <div class="input-group">
          <span class="regex-slash">/</span>
          <input 
            v-model="regexPattern" 
            type="text" 
            class="tool-input regex-input" 
            placeholder="输入正则表达式内容..."
            @input="testRegex"
          >
          <span class="regex-slash">/</span>
          <input 
            v-model="regexFlags" 
            type="text" 
            class="tool-input flags-input" 
            placeholder="修饰符 (g/i/m)"
            @input="testRegex"
          >
        </div>
      </div>

      <div class="tool-item">
        <label>测试文本</label>
        <textarea 
          v-model="testText" 
          class="tool-textarea" 
          placeholder="输入待测试的文本内容..."
          @input="testRegex"
        ></textarea>
      </div>
    </div>

    <div class="tool-result">
      <div class="result-header">
        <span>测试结果</span>
        <span v-if="matchCount > 0" class="match-badge">{{ matchCount }} 个匹配项</span>
        <span v-else-if="regexError" class="error-badge">表达式错误</span>
        <span v-else class="no-match-badge">无匹配</span>
      </div>
      <div 
        class="result-content" 
        v-html="highlightedText"
      ></div>
      <div v-if="regexError" class="error-detail">{{ regexError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const regexPattern = ref('');
const regexFlags = ref('g');
const testText = ref('');
const regexError = ref('');
const matchCount = ref(0);

const testRegex = () => {
  if (!regexPattern.value || !testText.value) {
    matchCount.value = 0;
    regexError.value = '';
    return;
  }

  try {
    const re = new RegExp(regexPattern.value, regexFlags.value || '');
    const matches = testText.value.match(re);
    matchCount.value = matches ? matches.length : 0;
    regexError.value = '';
  } catch (e: any) {
    regexError.value = e.message;
    matchCount.value = 0;
  }
};

const highlightedText = computed(() => {
  if (!regexPattern.value || !testText.value || regexError.value) {
    return testText.value;
  }

  try {
    const re = new RegExp(regexPattern.value, regexFlags.value.includes('g') ? regexFlags.value : regexFlags.value + 'g');
    // 使用特殊的 HTML 包装来高亮匹配项
    return testText.value.replace(re, (match) => {
      return `<mark class="regex-match">${match}</mark>`;
    });
  } catch (e) {
    return testText.value;
  }
});

const clear = () => {
  regexPattern.value = '';
  regexFlags.value = 'g';
  testText.value = '';
  regexError.value = '';
  matchCount.value = 0;
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
  display: flex;
  flex-direction: column;
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
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  padding: 0 0.75rem;

  &:focus-within {
    border-color: var(--primary-color);
  }

  .regex-slash {
    font-size: 1.2rem;
    color: var(--text-secondary);
    font-family: monospace;
    user-select: none;
  }

  .tool-input {
    border: none;
    background: transparent;
    padding: 0.75rem 0.25rem;
    color: var(--text-primary);
    font-family: monospace;
    font-size: 1rem;

    &:focus {
      outline: none;
    }

    &.regex-input {
      flex: 1;
    }

    &.flags-input {
      width: 100px;
      color: var(--primary-color);
    }
  }
}

.tool-textarea {
  width: 100%;
  height: 150px;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: monospace;
  font-size: 0.95rem;
  resize: vertical;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.tool-result {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.match-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.error-badge {
  background: #ef4444;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.no-match-badge {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.result-content {
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  color: var(--text-primary);
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;

  :deep(.regex-match) {
    background: rgba(var(--primary-color-rgb), 0.3);
    color: var(--primary-color);
    border-radius: 2px;
    padding: 0 1px;
    box-shadow: 0 0 0 1px rgba(var(--primary-color-rgb), 0.5);
    font-weight: 700;
  }
}

.error-detail {
  font-size: 0.85rem;
  color: #ef4444;
  font-family: monospace;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.5rem;
  border-radius: 0.4rem;
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
