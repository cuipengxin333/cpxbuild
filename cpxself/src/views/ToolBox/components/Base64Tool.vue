<template>
  <div class="tool-container">
    <div class="tool-header">
      <h3>Base64 编解码 / 图片转 Base64</h3>
      <div class="actions">
        <button class="tool-btn" @click="encodeBase64">编码</button>
        <button class="tool-btn" @click="decodeBase64">解码</button>
        <label class="tool-btn upload-btn">
          图片转 Base64
          <input type="file" accept="image/*" @change="handleImage" style="display: none">
        </label>
        <button class="tool-btn clear" @click="clear">清空</button>
      </div>
    </div>
    
    <div class="tool-body">
      <div class="input-section">
        <label>文本 / 图片</label>
        <textarea 
          v-model="input" 
          class="tool-textarea" 
          placeholder="输入文本或 Base64 字符串..."
        ></textarea>
      </div>
      
      <div class="output-section">
        <label>结果 (Base64 / 解码文本)</label>
        <div class="output-container">
          <textarea 
            v-model="output" 
            class="tool-textarea readonly" 
            readonly 
            placeholder="结果将显示在此..."
          ></textarea>
          <div v-if="isImage" class="image-preview">
            <img :src="output" alt="预览">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const input = ref('');
const output = ref('');

const isImage = computed(() => {
  return output.value.startsWith('data:image/');
});

const encodeBase64 = () => {
  if (!input.value) return;
  try {
    output.value = btoa(unescape(encodeURIComponent(input.value)));
  } catch (e) {
    output.value = '编码失败: ' + e;
  }
};

const decodeBase64 = () => {
  if (!input.value) return;
  try {
    output.value = decodeURIComponent(escape(atob(input.value)));
  } catch (e) {
    output.value = '解码失败: ' + e;
  }
};

const handleImage = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    output.value = event.target?.result as string;
    input.value = '图片已加载: ' + file.name;
  };
  reader.readAsDataURL(file);
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

.output-container {
  flex: 1;
  display: flex;
  gap: 1rem;
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

.image-preview {
  width: 200px;
  height: 200px;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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
  display: flex;
  align-items: center;
  justify-content: center;

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

  &.upload-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    font-weight: 600;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
}
</style>
