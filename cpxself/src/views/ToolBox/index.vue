<template>
  <div class="toolbox-page-container">
    <div class="toolbox-card">
      <div class="toolbox-header">
        <div class="tool-selector" ref="dropdownRef">
          <div 
            class="custom-select" 
            :class="{ 'is-open': isOpen }"
            @click="isOpen = !isOpen"
          >
            <div class="selected-value">
              <span class="tool-icon">{{ activeTool?.icon }}</span>
              <span class="tool-name">{{ activeTool?.name }}</span>
            </div>
            <div class="select-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <transition name="dropdown">
            <div v-if="isOpen" class="dropdown-list">
              <div 
                v-for="tool in toolOptions" 
                :key="tool.key" 
                class="tool-option"
                :class="{ 'is-active': activeToolKey === tool.key }"
                @click="selectTool(tool.key)"
              >
                <div class="option-content">
                  <span class="option-icon">{{ tool.icon }}</span>
                  <span class="option-name">{{ tool.name }}</span>
                  <span v-if="activeToolKey === tool.key" class="check-icon">✓</span>
                </div>
              </div>
            </div>
          </transition>
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
import { ref, computed, onMounted, onUnmounted, markRaw, type Component } from "vue";
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
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const activeTool = computed(() => {
  return toolOptions.find((tool) => tool.key === activeToolKey.value);
});

const activeComponent = computed(() => {
  return activeTool.value?.component;
});

const selectTool = (key: string) => {
  activeToolKey.value = key;
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.title = "开发者工具箱 - 八爪鱼";
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
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
  width: 260px;
  z-index: 100;

  .custom-select {
    width: 100%;
    padding: 0.75rem 1.25rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    user-select: none;

    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(var(--primary-color-rgb), 0.15);
    }

    &.is-open {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
      
      .select-arrow {
        transform: rotate(180deg);
      }
    }

    .selected-value {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .tool-icon {
        font-size: 1.2rem;
      }

      .tool-name {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-primary);
      }
    }

    .select-arrow {
      color: var(--text-secondary);
      transition: transform 0.3s ease;
      display: flex;

      svg {
        width: 1.1rem;
        height: 1.1rem;
      }
    }
  }

  .dropdown-list {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 1.25rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    z-index: 1000;
    padding: 0.5rem;
    overflow: hidden;

    .tool-option {
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 2px;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background: rgba(var(--primary-color-rgb), 0.1);
        color: var(--primary-color);
        transform: translateX(4px);
      }

      &.is-active {
        background: var(--primary-color);
        color: white;

        .option-name, .option-icon {
          color: white;
        }
      }

      .option-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .option-icon {
          font-size: 1.1rem;
        }

        .option-name {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .check-icon {
          font-size: 1rem;
          font-weight: bold;
        }
      }
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

// Transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

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
