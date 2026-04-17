<template>
  <div class="chat-header">
    <div class="header-main">
      <h1 class="chat-title">AI 智能对话</h1>
      <div class="model-selector-wrapper" ref="dropdownRef">
        <div 
          class="custom-select" 
          :class="{ 'is-open': isOpen, 'is-loading': isLoading }"
          @click="toggleDropdown"
        >
          <div class="selected-value">
            <span class="vendor-tag" v-if="selectedVendor">{{ selectedVendor }}</span>
            <span class="model-name">{{ selectedModelName }}</span>
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
              v-for="(models, group) in groupedModels" 
              :key="group" 
              class="model-group"
            >
              <div class="group-label">{{ group }}</div>
              <div 
                v-for="m in models" 
                :key="m" 
                class="model-option"
                :class="{ 'is-active': modelValue === m }"
                @click="selectModel(m)"
              >
                <div class="option-content">
                  <span class="option-name">{{ m.split("/")[1] }}</span>
                  <span v-if="modelValue === m" class="check-icon">✓</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <p class="chat-desc">正在使用: {{ modelValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { availableModels } from "../constants";

const props = defineProps<{
  modelValue: string;
  isLoading: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  if (props.isLoading) return;
  isOpen.value = !isOpen.value;
};

const selectModel = (model: string) => {
  emit("update:modelValue", model);
  isOpen.value = false;
};

const selectedVendor = computed(() => {
  return props.modelValue.split("/")[0];
});

const selectedModelName = computed(() => {
  return props.modelValue.split("/")[1];
});

const groupedModels = computed(() => {
  const groups: Record<string, string[]> = {};
  availableModels.forEach((model) => {
    const [vendor] = model.split("/");
    if (!groups[vendor]) groups[vendor] = [];
    groups[vendor].push(model);
  });
  return groups;
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.chat-header {
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(var(--bg-primary-rgb), 0.5);
  position: relative;
  z-index: 100;

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .model-selector-wrapper {
    position: relative;
    width: 280px;

    .custom-select {
      width: 100%;
      padding: 0.6rem 1rem;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      user-select: none;

      &:hover:not(.is-loading) {
        border-color: var(--primary-color);
        background: var(--bg-secondary);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.1);
      }

      &.is-open {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
        
        .select-arrow {
          transform: rotate(180deg);
        }
      }

      &.is-loading {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .selected-value {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        overflow: hidden;

        .vendor-tag {
          font-size: 0.7rem;
          padding: 0.1rem 0.4rem;
          background: rgba(var(--primary-color-rgb), 0.1);
          color: var(--primary-color);
          border-radius: 0.4rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .model-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .select-arrow {
        color: var(--text-secondary);
        transition: transform 0.3s ease;
        display: flex;
        flex-shrink: 0;

        svg {
          width: 1rem;
          height: 1rem;
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
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      padding: 0.5rem;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 2px;
      }

      .model-group {
        &:not(:last-child) {
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(var(--border-color-rgb), 0.5);
        }

        .group-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-secondary);
          padding: 0.4rem 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .model-option {
        padding: 0.6rem 0.75rem;
        border-radius: 0.6rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(var(--primary-color-rgb), 0.1);
          color: var(--primary-color);
        }

        &.is-active {
          background: var(--primary-color);
          color: white;

          .option-name {
            color: white;
          }
        }

        .option-content {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .option-name {
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-primary);
          }

          .check-icon {
            font-size: 0.9rem;
            font-weight: bold;
          }
        }
      }
    }
  }

  .chat-title {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg,
        var(--primary-color),
        var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .chat-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    opacity: 0.8;
  }
}

// Dropdown transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
