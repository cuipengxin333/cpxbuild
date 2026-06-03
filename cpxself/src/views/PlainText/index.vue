/Users/bytedance/Desktop/cpxbuild/cpxself/src/views/PlainText/index.vue
<template>
  <div class="plaintext-container">
    <div class="search-section">
      <h1 class="page-title">百度截图搜索</h1>
      <div class="search-box">
        <input
          v-model="searchText"
          type="text"
          placeholder="输入要搜索的内容..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-button" :disabled="loading">
          <span v-if="loading">搜索中...</span>
          <span v-else>📸 截图搜索</span>
        </button>
      </div>
    </div>

    <div v-if="screenshotUrl" class="result-section">
      <h2 class="result-title">搜索结果截图</h2>
      <div class="screenshot-wrapper">
        <div class="screenshot-scroll">
          <img :src="screenshotUrl" alt="搜索结果截图" class="screenshot-image" />
        </div>
        <div class="screenshot-actions">
          <button @click="downloadScreenshot" class="action-button">
            💾 下载图片
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-section">
      <p class="error-text">{{ error }}</p>
    </div>

    <div class="extension-info">
      <h3>📦 Chrome 扩展使用说明</h3>
      <p>1. 将项目根目录的 extension 文件夹加载到 Chrome 扩展中</p>
      <p>2. 点击页面上的「截图搜索」按钮即可使用</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const searchText = ref('');
const screenshotUrl = ref('');
const loading = ref(false);
const error = ref('');
let messageHandler: ((event: MessageEvent) => void) | null = null;

onMounted(() => {
  // 监听来自 content script 的响应
  messageHandler = (event: MessageEvent) => {
    if (event.data && event.data.type === 'BAIDU_SEARCH_EXTENSION_RESPONSE') {
      console.log('收到扩展响应:', event.data);
      handleExtensionResponse(event.data);
    }
  };
  window.addEventListener('message', messageHandler);
});

onUnmounted(() => {
  if (messageHandler) {
    window.removeEventListener('message', messageHandler);
  }
});

const handleExtensionResponse = (response: any) => {
  loading.value = false;
  
  if (response && response.success) {
    screenshotUrl.value = response.screenshot;
    error.value = '';
  } else {
    error.value = response?.error || '截图失败，请检查扩展是否正确安装';
  }
};

const handleSearch = async () => {
  if (!searchText.value.trim()) {
    error.value = '请输入搜索内容';
    return;
  }

  loading.value = true;
  error.value = '';
  screenshotUrl.value = '';

  try {
    // 发送消息给 content script
    window.postMessage({
      type: 'BAIDU_SEARCH_EXTENSION',
      action: 'searchAndScreenshot',
      query: searchText.value
    }, '*');
    
    // 设置超时
    setTimeout(() => {
      if (loading.value) {
        loading.value = false;
        error.value = '响应超时，请检查扩展是否正确安装';
      }
    }, 30000);
    
  } catch (err) {
    console.error('搜索错误:', err);
    loading.value = false;
    error.value = '搜索过程出错，请稍后重试';
  }
};

const downloadScreenshot = () => {
  if (!screenshotUrl.value) return;
  const link = document.createElement('a');
  link.href = screenshotUrl.value;
  link.download = `${searchText.value}.png`;
  link.click();
};
</script>

<style scoped lang="scss">
.plaintext-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.search-section {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-box {
  display: flex;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid var(--border-color);
  border-radius: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.1);
  }
}

.search-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(var(--primary-color-rgb), 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.result-section {
  margin-top: 3rem;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.screenshot-wrapper {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
}

.screenshot-scroll {
  max-height: 800px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: white;
}

.screenshot-image {
  width: 100%;
  display: block;
}

.screenshot-actions {
  margin-top: 1.5rem;
  text-align: center;
}

.action-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid var(--primary-color);
  border-radius: 0.75rem;
  background: transparent;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

.error-section {
  margin-top: 2rem;
  text-align: center;
}

.error-text {
  color: #ff4757;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 0.75rem;
  display: inline-block;
}

.extension-info {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .plaintext-container {
    padding: 2rem 1rem;
  }

  .search-box {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }
}
</style>