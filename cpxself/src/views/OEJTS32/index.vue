<template>
  <div class="test-container">
    <div class="test-card">
      <div class="test-header">
        <h1 class="test-title">OEJTS-32 人格测试</h1>
        <p class="test-desc">请根据您的实际感受选择最符合的选项</p>
      </div>

      <!-- 进度条 -->
      <div class="progress-section" :class="{ 'is-mini': showMiniProgress }">
        <div class="progress-info">
          <span v-if="!showMiniProgress">完成进度: {{ completedCount }} / {{ totalQuestions }}</span>
          <span v-else>{{ progressPercentage }}% 完成</span>
          <span v-if="!showMiniProgress">{{ progressPercentage }}%</span>
        </div>
        <div class="progress-bar-bg">
          <div
            class="progress-bar-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- 题目列表 -->
      <div class="questions-list">
        <div
          v-for="(q, index) in shuffledQuestions"
          :key="q.id"
          :id="'q-' + q.id"
          class="question-item"
          :class="{ 'is-answered': answers[q.id] }"
        >
          <div class="question-text">
            <span class="q-index">{{ index + 1 }}.</span>
            {{ q.text }}
          </div>

          <div class="options-group">
            <button
              v-for="opt in options"
              :key="opt.value"
              class="option-btn"
              :class="{ active: answers[q.id] === opt.value }"
              @click="handleSelect(q.id, opt.value)"
            >
              <span class="opt-val">{{ opt.value }}</span>
              <span class="opt-label">{{ opt.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 提交区域 -->
      <div class="submit-section">
        <button
          class="submit-btn"
          :disabled="!isAllAnswered || isSubmitting"
          @click="handleSubmit"
        >
          <span v-if="isSubmitting" class="loading-icon"></span>
          {{ submitBtnText }}
        </button>
      </div>
    </div>

    <!-- 分析完成弹窗 -->
    <transition name="modal-fade">
      <div
        v-if="showSuccessModal"
        class="success-modal-overlay"
        @click.self="showSuccessModal = false"
      >
        <div class="success-modal">
          <div class="success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h2 class="modal-title">分析已完成</h2>
          <p class="modal-desc">我们已经为您生成了详细的人格分析报告</p>
          <button class="view-report-btn" @click="goToResult">
            查看报告
            <svg
              class="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  reactive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";
import { useRouter } from "vue-router";
import { questions } from "./questions";
import { testStore } from "./store";
import axios from "axios";

const { appContext } = getCurrentInstance()!;
const router = useRouter();

// 题目随机化逻辑
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const shuffledQuestions = ref(shuffleArray(questions));
const totalQuestions = questions.length;
const options = [
  { label: "完全不同意", value: 1 },
  { label: "不同意", value: 2 },
  { label: "中立", value: 3 },
  { label: "同意", value: 4 },
  { label: "完全同意", value: 5 },
];

// 存储答案
const answers = reactive<Record<number, number>>({});
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showMiniProgress = ref(false);

const handleScroll = () => {
  showMiniProgress.value = window.scrollY > 200;
};

onMounted(() => {
  document.title = "OEJTS-32 人格测试";
   window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const completedCount = computed(() => Object.keys(answers).length);
const progressPercentage = computed(() =>
  Math.round((completedCount.value / totalQuestions) * 100)
);
const isAllAnswered = computed(() => completedCount.value === totalQuestions);

const submitBtnText = computed(() => {
  if (isSubmitting.value) return "分析中...";
  if (isAllAnswered.value) return "提交测试";
  return `还剩 ${totalQuestions - completedCount.value} 题未完成`;
});

const handleSelect = (questionId: number, value: number) => {
  answers[questionId] = value;
};

const handleSubmit = async () => {
  if (!isAllAnswered.value || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    const response = await axios.post("https://openjung.org/api/calculate", {
      answers: answers,
      locale: "zh",
      save: false,
    });

    testStore.setResult(response.data);
    showSuccessModal.value = true;

    // 不再直接使用 toast，改用精美弹窗
  } catch (error) {
    console.error("提交失败:", error);
    appContext.config.globalProperties.$toast({
      message: "提交失败，请检查网络后重试",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const goToResult = () => {
  showSuccessModal.value = false;
  router.push("/oejts32/result");
};
</script>

<style lang="scss" scoped>
.test-container {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  position: relative;
}

.test-card {
  background: var(--card-bg);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.test-header {
  text-align: center;
  margin-bottom: 2.5rem;

  .test-title {
    font-size: 2rem;
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

  .test-desc {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

.progress-section {
  position: sticky;
  top: calc(var(--nav-height) + 0.5rem);
  z-index: 10;
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-mini {
    padding: 0.6rem 1.25rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    background: var(--nav-bg);
    backdrop-filter: blur(15px);
    border-color: rgba(var(--primary-color-rgb), 0.2);

    .progress-info {
      margin-bottom: 0.4rem;
      font-size: 0.75rem;
    }

    .progress-bar-bg {
      height: 4px;
    }
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .progress-bar-bg {
    height: 8px;
    background: var(--bg-primary);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--accent-color)
    );
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.question-item {
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--bg-primary);
  border: 1px solid transparent;
  transition: all 0.3s ease;

  &.is-answered {
    border-color: rgba(var(--primary-color-rgb), 0.3);
    background: var(--card-bg);
  }

  .question-text {
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    line-height: 1.6;

    .q-index {
      color: var(--primary-color);
      font-weight: 700;
      margin-right: 0.5rem;
    }
  }
}

.options-group {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  .opt-val {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .opt-label {
    font-size: 0.7rem;
    text-align: center;
    word-break: break-all;
  }

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-2px);
  }

  &.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
    box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3);
  }
}

.submit-section {
  margin-top: 4rem;
  display: flex;
  justify-content: center;

  .submit-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 3rem;
    font-size: 1.125rem;
    font-weight: 700;
    border-radius: 1rem;
    border: none;
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--accent-color)
    );
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    &:disabled {
      background: var(--text-secondary);
      cursor: not-allowed;
      opacity: 0.6;
      box-shadow: none;
    }

    .loading-icon {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

/* 分析完成弹窗样式 */
.success-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.success-modal {
  background: var(--card-bg);
  width: 100%;
  max-width: 400px;
  border-radius: 2rem;
  padding: 3rem 2rem;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;

  .success-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #67c23a, #409eff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 20px rgba(103, 194, 58, 0.3);

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  .modal-desc {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 2.5rem;
  }

  .view-report-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.25rem;
    font-size: 1.125rem;
    font-weight: 700;
    border-radius: 1rem;
    border: none;
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--accent-color)
    );
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

      .arrow-icon {
        transform: translateX(5px);
      }
    }

    .arrow-icon {
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.3s ease;
    }
  }
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-fade-enter-active {
  animation: modal-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-leave-active {
  animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .test-card {
    padding: 1.25rem;
  }
  .options-group {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  .option-btn {
    flex-direction: row;
    justify-content: flex-start;
    padding: 0.75rem 1rem;
    gap: 1rem;
    .opt-label {
      font-size: 0.9rem;
    }
  }
  .test-title {
    font-size: 1.5rem;
  }
  .question-item {
    padding: 1rem;
  }
}
</style>
