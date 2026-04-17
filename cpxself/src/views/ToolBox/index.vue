<template>
  <div class="toolbox-page-container">
    <div class="toolbox-card">
      <div class="toolbox-header">
        <div class="tool-selector">
          <select v-model="activeToolKey" class="tool-select">
            <option
              v-for="tool in toolOptions"
              :key="tool.key"
              :value="tool.key"
            >
              {{ tool.icon }} {{ tool.name }}
            </option>
          </select>
          <div class="select-arrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div class="tool-info">
          <h1 class="tool-title">{{ activeTool?.name }}</h1>
          <p class="tool-desc">{{ activeTool?.desc }}</p>
        </div>
      </div>

      <div class="tool-content">
        <transition name="tool-fade" mode="out-in">
          <component :is="activeComponent" :key="activeToolKey" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw, type Component } from "vue";
import JsonTool from "./components/JsonTool.vue";
import TimestampTool from "./components/TimestampTool.vue";
import RadixTool from "./components/RadixTool.vue";
import UrlTool from "./components/UrlTool.vue";
import Base64Tool from "./components/Base64Tool.vue";
import RandomTool from "./components/RandomTool.vue";
import RegexTool from "./components/RegexTool.vue";

interface ToolOption {
  key: string;
  name: string;
  icon: string;
  desc: string;
  component: Component;
}

const toolOptions: ToolOption[] = [
  {
    key: "json",
    name: "JSON 工具",
    icon: "📦",
    desc: "提供 JSON 格式化、压缩及转义功能，支持校验 JSON 合法性。",
    component: markRaw(JsonTool),
  },
  {
    key: "timestamp",
    name: "时间戳转换",
    icon: "⏰",
    desc: "支持秒/毫秒时间戳与北京时间的互相转换，自动识别时区。",
    component: markRaw(TimestampTool),
  },
  {
    key: "radix",
    name: "进制转换",
    icon: "🔢",
    desc: "支持二进制、八进制、十进制、十六进制及 ASCII 码的互相转换。",
    component: markRaw(RadixTool),
  },
  {
    key: "url",
    name: "URL 工具",
    icon: "🔗",
    desc: "提供 URL 编码、解码以及参数解析功能。",
    component: markRaw(UrlTool),
  },
  {
    key: "base64",
    name: "Base64 工具",
    icon: "🖼️",
    desc: "提供文本 Base64 编解码，支持图片直接转为 Base64 字符串。",
    component: markRaw(Base64Tool),
  },
  {
    key: "random",
    name: "随机生成器",
    icon: "🎲",
    desc: "支持自定义长度的随机字符串、UUID 以及强密码生成。",
    component: markRaw(RandomTool),
  },
  {
    key: "regex",
    name: "正则测试器",
    icon: "🔍",
    desc: "在线测试正则表达式，支持修饰符配置并实时高亮匹配结果。",
    component: markRaw(RegexTool),
  },
];

const activeToolKey = ref("json");

const activeTool = computed(() => {
  return toolOptions.find((tool) => tool.key === activeToolKey.value);
});

const activeComponent = computed(() => {
  return activeTool.value?.component;
});

onMounted(() => {
  document.title = "开发者工具箱 - 八爪鱼";
});
</script>

<style scoped lang="scss">
.toolbox-page-container {
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
}

.toolbox-card {
  background: var(--card-bg);
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
}

.toolbox-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.tool-selector {
  position: relative;
  width: 240px;

  .tool-select {
    width: 100%;
    padding: 0.75rem 1.5rem;
    padding-right: 3rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    appearance: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(var(--primary-color-rgb), 0.2);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    option {
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 0.5rem;
    }
  }

  .select-arrow {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-secondary);

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

.tool-info {
  .tool-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--accent-color)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tool-desc {
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 700px;
  }
}

.tool-content {
  min-height: 400px;
}

/* 动画 */
.tool-fade-enter-active,
.tool-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tool-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 768px) {
  .toolbox-card {
    padding: 1.5rem;
  }

  .tool-selector {
    width: 100%;
  }

  .tool-info {
    .tool-title {
      font-size: 1.75rem;
    }
  }
}
</style>
