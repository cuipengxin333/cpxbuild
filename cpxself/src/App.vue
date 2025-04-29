<template>
  <div class="app-container" :class="{ dark: isDark }">
    <div class="wave-background">
      <div class="wave-1"></div>
      <div class="wave-2"></div>
    </div>
    <nav class="navigation">
      <div class="nav-content">
        <div class="logo-container">
          <img class="logoImg" src="/logo.svg" alt="logo" />
          <router-link to="/" class="logo">八爪鱼</router-link>
          <div class="logo-text">
            <div class="hidiv"></div>
            <div
              class="hidiv-text"
              :style="{ color: isDark ? '#fff' : '#000' }"
            >
              八爪鱼八爪鱼八爪鱼
            </div>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="menu-toggle" @click="toggleMenu">
          <svg
            v-if="!isMenuOpen"
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="nav-right" :class="{ active: isMenuOpen }">
          <div class="nav-links">
            <router-link
              v-for="item in navbarList"
              :key="item.href"
              :to="item.href"
              class="nav-link"
              active-class="active"
              @click="isMenuOpen = false"
            >
              {{ item.name }}
            </router-link>
          </div>
          <button
            ref="darkButton"
            class="theme-toggle"
            @click="handleThemeToggle"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          >
            <svg
              v-if="isDark"
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const navbarList = ref([
  { name: "主页", href: "/" },
  { name: "玩玩看", href: "/showcase" },
  { name: "项目经验", href: "/projects" },
]);

const isDark = ref(true);
const isMenuOpen = ref(false);

const updateThemeClass = () => {
  const root = document.documentElement;
  if (isDark.value) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
    updateThemeClass();
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    updateThemeClass();
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      isDark.value = e.matches;
      updateThemeClass();
    }
  });
});

watch(isDark, (newValue) => {
  localStorage.setItem("theme", newValue ? "dark" : "light");
  updateThemeClass();
});

const darkButton = ref<HTMLButtonElement | null>(null);

// 核心动画切换逻辑
const handleThemeToggle = () => {
  const root = document.documentElement;

  if (!(document as any).startViewTransition) {
    isDark.value = !isDark.value;
    return;
  }

  // 1. 获取按钮位置
  const buttonRect = (
    darkButton.value as HTMLButtonElement
  )?.getBoundingClientRect();
  if (!buttonRect) {
    isDark.value = !isDark.value;
    return;
  }

  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;

  if (isDark.value) {
    root.style.backgroundColor = "#111827"; // 深色背景
  } else {
    root.style.backgroundColor = "#f8fafc"; // 浅色背景
  }

  const isCurrentlyDark = isDark.value;

  const transition = (document as any).startViewTransition(() => {
    isDark.value = !isDark.value;
  });

  transition.ready.then(() => {
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);

    const startCircle = isCurrentlyDark
      ? `circle(${maxRadius}px at ${centerX}px ${centerY}px)`
      : `circle(0px at ${centerX}px ${centerY}px)`;
    const endCircle = isCurrentlyDark
      ? `circle(0px at ${centerX}px ${centerY}px)`
      : `circle(${maxRadius}px at ${centerX}px ${centerY}px)`;

    const animation = root.animate(
      [{ clipPath: startCircle }, { clipPath: endCircle }],
      {
        duration: 800,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    animation.finished.then(() => {
      root.style.clipPath = "none";
      root.style.backgroundColor = "";
    });
  });

  setTimeout(() => {
    toggleMenu();
  }, 1000);
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>


<style lang='scss'>
:root {
  --primary-color: #d1c5e3;
  --primary-color-rgb: 79, 70, 229;
  --accent-color: #da7be3;
  --accent-color-rgb: 96, 165, 250;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --bg-primary: #111827;
  --bg-primary-rgb: 17, 24, 39;
  --bg-secondary: #1f2937;
  --card-bg: rgba(31, 41, 55, 0.7);
  --nav-bg: rgba(17, 24, 39, 0.5);
  --border-color: rgba(255, 255, 255, 0.1);
  --wave-color-1: rgba(79, 70, 229, 0.15);
  --wave-color-2: rgba(96, 165, 250, 0.1);
  --wave-blur: 120px;
  --wave-opacity-1: 0.5;
  --wave-opacity-2: 0.3;
}

.app-container:not(.dark) {
  --primary-color: #d1c5e3;
  --primary-color-rgb: 67, 56, 202;
  --accent-color: #da7be3;
  --accent-color-rgb: 59, 130, 246;
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --bg-primary: #f8fafc;
  --bg-primary-rgb: 248, 250, 252;
  --bg-secondary: #ffffff;
  --card-bg: rgba(255, 255, 255, 0.9);
  --nav-bg: rgba(255, 255, 255, 0.5);
  --border-color: rgba(0, 0, 0, 0.1);
  --wave-color-1: rgba(67, 56, 202, 0.08);
  --wave-color-2: rgba(59, 130, 246, 0.05);
  --wave-blur: 80px;
  --wave-opacity-1: 0.4;
  --wave-opacity-2: 0.2;
}

/* Constants */
:root {
  --nav-height: 80px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: var(--transition);
}

#app {
  width: 100%;
  height: 100%;
}

.app-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  transition: var(--transition);
  position: relative;
}

.main-content {
  flex: 1;
  width: 100%;
  margin-top: var(--nav-height);
  position: relative;
  z-index: 2;
  overflow-x: hidden;
}

.wave-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  transition: var(--transition);
}

.wave-1,
.wave-2 {
  position: absolute;
  width: 200%;
  height: 200%;
  bottom: -50%;
  left: -50%;
  border-radius: 45%;
  transform-origin: center;
  background: var(--wave-color-1);
  opacity: var(--wave-opacity-1);
  animation: wave 20s infinite linear;
  filter: blur(var(--wave-blur));
  transition: var(--transition);
}

.wave-2 {
  background: var(--wave-color-2);
  opacity: var(--wave-opacity-2);
  animation-duration: 15s;
  filter: blur(calc(var(--wave-blur) * 1.5));
}

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background-color: var(--bg-primary);
  z-index: 3;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.nav-content {
  height: 100%;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;

  .logoImg {
    width: 50px;
    height: 50px;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    text-decoration: none;
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--accent-color)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    z-index: 20;
  }

  .logo-text {
    position: relative;
    width: 150px;
    height: 2rem;
    line-height: 2rem;
    font-weight: bold;
    text-align: center;
    overflow: hidden;

    .hidiv {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(transparent 1px, var(--bg-primary) 1px);
      background-size: 4px 4px;
      backdrop-filter: saturate(10%) blur(4px);
    }
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border-radius: 0.5rem;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  font-weight: bold;
  color: var(--primary-color);
  background: var(--bg-secondary);
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.theme-toggle .icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: var(--transition);
}

.theme-toggle:hover .icon {
  transform: rotate(15deg);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  z-index: 20;
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .menu-toggle {
    display: block;
  }

  .nav-right {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-primary);
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .nav-right.active {
    transform: translateX(0);
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    font-size: 1.25rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes wave {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
