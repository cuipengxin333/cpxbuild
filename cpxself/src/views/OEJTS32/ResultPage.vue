<template>
  <div class="result-page-container" :style="{ '--personality-color': themeColor }">
    <div v-if="!result" class="no-data">
      <p>暂无测试结果，请先完成测试</p>
      <button class="primary-btn" @click="goBack">前往测试</button>
    </div>

    <div v-else class="result-content">
      <!-- 头部：人格类型 -->
      <section class="result-card header-card">
        <div class="personality-avatar-container">
          <div 
            class="personality-sprite-avatar" 
            :style="avatarStyle"
          ></div>
        </div>
        <div class="type-badge">{{ result.type }}</div>
        <h1 class="personality-name">{{ result.typeInfo?.name }}</h1>
        <p class="nickname">「 {{ result.typeInfo?.nickname }} 」</p>
        <div class="traits-container">
          <span v-for="trait in result.traits" :key="trait" class="trait-tag">{{ trait }}</span>
        </div>
      </section>

      <!-- 维度分析 -->
      <section class="result-card analysis-card">
        <h2 class="section-title">维度分析</h2>
        <div class="dimension-grid">
          <div v-for="(pair, idx) in dimensionPairs" :key="idx" class="dimension-row">
            <div class="dim-labels-top">
              <span class="dim-label-item" :class="{ 'active': pair.left.val >= 50 }">
                <span class="dim-char">{{ pair.left.char }}</span> {{ pair.left.name }} ({{ pair.left.char }})
              </span>
              <span class="dim-label-item" :class="{ 'active': pair.right.val > 50 }">
                {{ pair.right.name }} ({{ pair.right.char }}) <span class="dim-char">{{ pair.right.char }}</span>
              </span>
            </div>
            
            <div class="dim-bar-wrapper">
              <!-- 左侧倾向背景 -->
              <div class="dim-track">
                <div 
                  class="dim-fill-original left" 
                  :class="{ 'is-dominant': pair.left.val >= 50 }"
                  :style="{ 
                    width: (pair.left.val) + '%', 
                    backgroundColor: pair.left.val >= 50 ? 'var(--personality-color)' : '#9ca3af' 
                  }"
                >
                  <span v-if="pair.left.val >= 50" class="percentage-text">{{ pair.left.val }}%</span>
                </div>
              </div>
              
              <!-- 中间装饰点 -->
              <div class="dim-center-dot">
              </div>
              
              <!-- 右侧倾向背景 -->
              <div class="dim-track">
                <div 
                  class="dim-fill-original right" 
                  :class="{ 'is-dominant': pair.right.val > 50 }"
                  :style="{ 
                    width: (pair.right.val) + '%', 
                    backgroundColor: pair.right.val > 50 ? 'var(--personality-color)' : '#9ca3af' 
                  }"
                >
                  <span v-if="pair.right.val > 50" class="percentage-text">{{ pair.right.val }}%</span>
                </div>
              </div>
            </div>

            <div class="dim-labels-bottom">
              <span class="dim-val" :style="{ color: pair.left.val >= 50 ? 'var(--personality-color)' : '' }">{{ pair.left.val }}%</span>
              <span class="dim-val" :style="{ color: pair.right.val > 50 ? 'var(--personality-color)' : '' }">{{ pair.right.val }}%</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细描述 -->
      <section class="result-card detail-card">
        <h2 class="section-title">人格描述</h2>
        <p class="description-text">{{ result.typeInfo?.description }}</p>
      </section>

      <!-- 优缺点 -->
      <div class="info-grid">
        <section class="result-card strength-card">
          <h2 class="section-title">核心优势</h2>
          <ul class="info-list">
            <li v-for="(item, i) in result.typeInfo?.strengths" :key="i">{{ item }}</li>
          </ul>
        </section>
        <section class="result-card weakness-card">
          <h2 class="section-title">潜在弱点</h2>
          <ul class="info-list">
            <li v-for="(item, i) in result.typeInfo?.weaknesses" :key="i">{{ item }}</li>
          </ul>
        </section>
      </div>

      <!-- 匹配人格 -->
      <section class="result-card match-card">
        <h2 class="section-title">灵魂伴侣 / 最佳拍档</h2>
        <div class="match-types">
          <span v-for="type in result.typeInfo?.compatibleTypes" :key="type" class="match-tag">{{ type }}</span>
        </div>
      </section>

      <!-- 名人例子 -->
      <section class="result-card famous-card">
        <h2 class="section-title">代表人物</h2>
        <div class="famous-list">
          <span v-for="name in result.typeInfo?.famousExamples" :key="name" class="famous-tag">{{ name }}</span>
        </div>
      </section>

      <!-- 底部按钮 -->
      <div class="action-footer">
        <button class="retest-btn" @click="handleRetest">再测一次</button>
        <button class="share-btn" @click="handleShare">分享结果</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick, getCurrentInstance } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { testStore } from './store';

const { appContext } = getCurrentInstance()!;
const router = useRouter();

const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

onMounted(async () => {
  await nextTick();
  scrollToTop();
});

// 如果是在结果页内更新（例如重新测试后再次进入）
onBeforeRouteUpdate(async (_to, _from, next) => {
  next();
  await nextTick();
  scrollToTop();
});

const result = computed(() => testStore.result);

// 根据截图定义四大人格族群配色
const themeColor = computed(() => {
  if (!result.value?.type) return '#A855F7';
  const type = result.value.type.toUpperCase();
  
  // 探险家 (Explorers) - 黄色系
  if (['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(type)) return '#FCE000';
  // 外交官 (Diplomats) - 绿色系
  if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(type)) return '#9FCA65';
  // 分析家 (Analysts) - 紫色系
  if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(type)) return '#8A4F71';
  // 守护者 (Sentinels) - 蓝色系
  if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(type)) return '#52BDD7';
  
  return '#A855F7';
});

// 人格头像精灵图逻辑
const avatarStyle = computed(() => {
  if (!result.value?.type) return {};
  
  // 假设图片是 4x4 的网格布局，总共16个人格
  // 映射表：定义每个人格在网格中的位置 (row, col) 从 0 开始
  const spriteMap: Record<string, { r: number, c: number }> = {
    'ENFJ': { r: 1, c: 3 }, 'ENFP': { r: 1, c: 0 }, 'ENTJ': { r: 2, c: 3 }, 'ENTP': { r: 2, c: 1 },
    'ESFJ': { r: 3, c: 3 }, 'ESFP': { r: 0, c: 1 }, 'ESTJ': { r: 3, c: 1 }, 'ESTP': { r: 0, c: 2 },
    'INFJ': { r: 1, c: 2 }, 'INFP': { r: 1, c: 1 }, 'INTJ': { r: 2, c: 2 }, 'INTP': { r: 2, c: 0 },
    'ISFJ': { r: 3, c: 0 }, 'ISFP': { r: 0, c: 3 }, 'ISTJ': { r: 3, c: 2 }, 'ISTP': { r: 0, c: 0 },
  };

  const pos = spriteMap[result.value.type.toUpperCase()] || { r: 0, c: 0 };
  
  // 计算百分比偏移量 (100% / (n-1))
  // 如果是 4x4，则偏移步长是 33.3333%
  const moveX = pos.c * (100 / 3);
  const moveY = pos.r * (100 / 3);

  return {
    backgroundImage: `url('/MBTI32.png')`, // 请确保 public 目录下有这张图
    backgroundPosition: `${moveX}% ${moveY}%`,
    backgroundSize: '400% 400%' // 因为是 4x4 布局，所以背景图要放大到 400%
  };
});

const dimensionPairs = computed(() => {
  if (!result.value?.percentiles) return [];
  const p = result.value.percentiles;
  return [
    { 
      left: { char: 'E', name: '外向', val: p.E }, 
      right: { char: 'I', name: '内向', val: p.I } 
    },
    { 
      left: { char: 'S', name: '实感', val: p.S }, 
      right: { char: 'N', name: '直觉', val: p.N } 
    },
    { 
      left: { char: 'T', name: '思考', val: p.T }, 
      right: { char: 'F', name: '情感', val: p.F } 
    },
    { 
      left: { char: 'J', name: '判断', val: p.J }, 
      right: { char: 'P', name: '知觉', val: p.P } 
    }
  ];
});

const goBack = () => router.push('/oejts32');
const handleRetest = () => {
  testStore.clearResult();
  router.push('/oejts32');
};

const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    appContext.config.globalProperties.$toast({
      message: '链接已复制，快去分享吧~',
      type: 'success',
    });
  } catch (err) {
    console.error('复制失败:', err);
    // 降级处理
    const input = document.createElement('input');
    input.value = window.location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    appContext.config.globalProperties.$toast({
      message: '链接已复制，快去分享吧~',
      type: 'success',
    });
  }
};
</script>

<style lang="scss" scoped>
.result-page-container {
  padding: 2rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
}

.result-card {
  background: var(--card-bg);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.header-card {
  text-align: center;
  background: linear-gradient(135deg, var(--card-bg), var(--bg-primary));
  
  .personality-avatar-container {
    width: 100%;
    max-width: 200px; 
    aspect-ratio: 150 / 180;
    margin: 0 auto;
    overflow: hidden;
  }

  .personality-sprite-avatar {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    transition: background-position 0.5s ease;
  }

  .type-badge {
    display: inline-block;
    font-size: 4rem;
    font-weight: 900;
    letter-spacing: 6px;
    background: var(--personality-color);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  .personality-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .nickname {
    font-size: 1.25rem;
    color: var(--personality-color);
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .trait-tag {
    display: inline-block;
    padding: 0.5rem 1.25rem;
    margin: 0.25rem;
    background: var(--bg-secondary);
    border-radius: 2rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    width: 4px;
    height: 1.5rem;
    background: var(--personality-color);
    margin-right: 0.75rem;
    border-radius: 2px;
  }
}

.dimension-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dimension-row {
  .dim-labels-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    color: var(--text-secondary);
    
    .dim-label-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.6;
      transition: all 0.3s ease;
      
      &.active {
        opacity: 1;
        font-weight: 700;
        color: var(--text-primary);
      }
      
      .dim-char {
        font-size: 1.2rem;
        font-weight: 900;
      }
    }
  }

  .dim-bar-wrapper {
    display: flex;
    align-items: center;
    height: 20px;
    gap: 6px;
  }

  .dim-track {
    flex: 1;
    height: 100%;
    background: #e5e7eb;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .dim-fill-original {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.3; /* 默认暗色/非高亮 */
    
    &.is-dominant {
      opacity: 1; /* 高亮主导侧 */
    }
    
    &.left {
      right: 0;
    }
    
    &.right {
      left: 0;
    }

    .percentage-text {
      color: white;
      font-size: 0.85rem;
      font-weight: 800;
    }
  }

  .dim-center-dot {
    width: 10px;
    height: 10px;
    background: #e5e7eb;
    border-radius: 50%;
  }

  .dim-labels-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-secondary);
  }
}

.description-text {
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.info-list {
  list-style: none;
  padding: 0;
  
  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.5;
    color: var(--text-secondary);

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--personality-color);
      font-weight: bold;
    }
  }
}

.match-types, .famous-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.match-tag, .famous-tag {
  padding: 0.6rem 1.5rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.match-tag {
  color: var(--personality-color);
  border-color: var(--personality-color);
}

.action-footer {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0 4rem;

  .retest-btn, .share-btn {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    white-space: nowrap;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
  }

  .retest-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .share-btn {
    background: var(--personality-color);
    color: #fff;
  }
}

.no-data {
  text-align: center;
  padding: 10rem 2rem;
  
  p {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  .primary-btn {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    border: none;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .header-card {
    .type-badge { font-size: 3rem; }
    .personality-name { font-size: 2rem; }
  }
}
</style>
