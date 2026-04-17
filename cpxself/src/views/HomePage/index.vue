<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title animate">
          <span class="greeting">你好</span>
          <!-- <span class="name">崔朋鑫</span> -->
        </h1>
        <p class="hero-subtitle animate">
          👋 Hi，欢迎来到我的个人空间！
          我是一个热爱技术与创造的开发者，专注于前端开发、用户体验与界面设计。
          在这里，我分享我的项目经验、学习笔记，以及一些关于科技与生活的思考。
          希望你能在这里找到灵感，若有任何交流想法，欢迎随时联系我！🚀
        </p>
      </div>
      <div class="hero-image animate">
        <img src="/index.jpg" alt="一个图片" />
      </div>
    </div>
    
    <!-- MBTI 测试气泡 -->
    <transition name="bubble-fade">
      <div v-if="showBubble" class="mbti-bubble-container">
        <div class="mbti-bubble" @click="goToMBTI">
          <div class="bubble-content">
            <span class="bubble-tag">热门</span>
            <span class="bubble-text">MBTI测试，去测一测</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <button class="close-btn" @click.stop="closeBubble" title="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showBubble = ref(false);

onMounted(() => {
  document.title = "八爪鱼";
  // 延迟 1 秒显示气泡，增加吸引力
  setTimeout(() => {
    const isClosed = sessionStorage.getItem('mbti_bubble_closed');
    if (!isClosed) {
      showBubble.value = true;
    }
  }, 1000);
});

const closeBubble = () => {
  showBubble.value = false;
  sessionStorage.setItem('mbti_bubble_closed', 'true');
};

const goToMBTI = () => {
  router.push('/oejts32');
};
</script>

<style scoped>
.mbti-bubble-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
}

.mbti-bubble {
  position: relative;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  padding: 0.75rem 1.5rem;
  border-radius: 3rem;
  color: white;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 25px rgba(var(--primary-color-rgb), 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

.mbti-bubble:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 35px rgba(var(--primary-color-rgb), 0.4);
}

.bubble-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 0.95rem;
  padding-right: 0.5rem;
}

.bubble-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.15rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.mbti-bubble:hover .arrow-icon {
  transform: translateX(4px);
}

.close-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.close-btn:hover {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
  transform: scale(1.1);
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 动画 */
.bubble-fade-enter-active,
.bubble-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bubble-fade-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(50px);
}

.bubble-fade-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}

@media (max-width: 768px) {
  .mbti-bubble-container {
    bottom: 1.5rem;
    right: 1.5rem;
    left: 1.5rem;
  }
  
  .mbti-bubble {
    width: 100%;
    justify-content: center;
  }
}

.home-container {
  width: 100%;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
  position: relative;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 4px solid var(--primary-color);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  border-color: var(--accent-color);
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.about-section {
  padding: 2rem;
  border-radius: 1rem;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  position: relative;
  display: inline-block;
}

.about-section h2::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 3px;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.hero-section {
  flex: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 4rem;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  position: relative;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.greeting {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--text-primary);
  font-weight: 600;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  line-height: 1.8;
  font-weight: 400;
  max-width: 600px;
}

.social-links {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  font-weight: 500;
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.hero-image {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.hero-image::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--primary-color-rgb), 0.2),
    rgba(var(--accent-color-rgb), 0.2)
  );
  z-index: 1;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-image:hover img {
  transform: scale(1.05);
}

@media (max-width: 1024px) {
  .hero-section {
    padding: 3rem;
    gap: 3rem;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    padding: 2rem;
    text-align: center;
    margin: 0 auto;
    justify-items: center;
  }

  .hero-content {
    order: 2;
    margin: 0 auto;
  }

  .hero-image {
    order: 1;
    max-width: 400px;
  }

  .social-links {
    justify-content: center;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    grid-template-columns: 1fr;
    padding: 0.7rem;
    text-align: center;
    margin: 0 auto;
    justify-items: center;
    align-items: center;
  }

  .social-links {
    flex-direction: column;
    align-items: stretch;
  }

  .social-link {
    justify-content: center;
  }

  .hero-image {
    max-width: 300px;
  }
}

.animate {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.hero-title {
  animation-delay: 0.2s;
}

.hero-subtitle {
  animation-delay: 0.4s;
}

.social-link:nth-child(1) {
  animation-delay: 0.6s;
}

.social-link:nth-child(2) {
  animation-delay: 0.7s;
}

.social-link:nth-child(3) {
  animation-delay: 0.8s;
}

.hero-image {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 