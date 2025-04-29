<template>
  <div class="showcase-container">
    <div class="showcase-header">
      <div class="header-content">
        <h1 class="main-title">创意展示</h1>
        <p class="subtitle">探索一些有趣的效果和创意</p>
      </div>
      <div class="header-decoration"></div>
    </div>

    <div class="showcase-grid">
      <div
        v-for="item in contList"
        :key="item.id"
        class="showcase-item"
        @click="handleClick(item)"
      >
        <div class="item-content">
          <div class="item-image">
            <img :src="item.img" :alt="item.title" />
            <div class="item-overlay">
              <span class="view-more">查看详情</span>
            </div>
          </div>
          <div class="item-info">
            <h3 class="item-title">{{ item.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div v-show="popoverShow" class="showcase-modal">
      <div class="modal-content">
        <div class="close-button" @click="handleClose">
          <span class="close-icon">×</span>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getCurrentInstance } from "vue";
import getUserEnvironment from "../../utils/getUserEnv";

const { appContext } = getCurrentInstance();

const router = useRouter();

const popoverShow = ref(false);

const contList = ref([
  {
    id: 1,
    title: "圆脸卸载动画",
    link: "unloadAnimation",
    img: "/logo.svg",
    isDesktop: true,
  },
  {
    id: 2,
    title: "圆脸卸载动画",
    link: "unloadAnimation",
    img: "/logo.svg",
    isDesktop: false,
  },
  {
    id: 3,
    title: "圆脸卸载动画",
    link: "unloadAnimation",
    img: "/logo.svg",
    isDesktop: true,
  },
  {
    id: 4,
    title: "圆脸卸载动画",
    link: "unloadAnimation",
    img: "/logo.svg",
    isDesktop: true,
  },
  {
    id: 5,
    title: "圆脸卸载动画",
    link: "unloadAnimation",
    img: "/logo.svg",
    isDesktop: true,
  },
]);

const handleClick = (item) => {
  const isDesktop = getUserEnvironment() === "desktop";

  if (item.isDesktop && !isDesktop) {
    appContext.config.globalProperties.$toast({
      message: "请使用电脑端查看",
      type: "warning",
      duration: 3000,
    });
    return;
  }

  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  popoverShow.value = !popoverShow.value;
  router.push({ name: item.link });
};

const handleClose = () => {
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";

  popoverShow.value = false;
  router.back();
};
</script>

<style lang="scss">
.showcase-container {
  min-height: 100vh;
  background: var(--bg-color);
  padding: 2rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40vh;
    background: linear-gradient(
      135deg,
      var(--primary-color) 0%,
      var(--secondary-color) 100%
    );
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
    z-index: 0;
  }
}

.showcase-header {
  position: relative;
  z-index: 1;
  padding: 1rem 2rem;
  text-align: center;
  color: var(--text-primary);

  .header-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .main-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(
      to right,
      var(--text-primary),
      var(--text-primary)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .header-decoration {
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--text-primary) 50%,
      var(--text-primary) 20%,
      transparent 100%
    );
  }
}

.showcase-grid {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.showcase-item {
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-secondary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);

    .item-overlay {
      opacity: 1;
    }

    .item-image img {
      transform: scale(1.05);
    }
  }

  .item-content {
    position: relative;
  }

  .item-image {
    position: relative;
    padding-top: 75%;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  .item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    .view-more {
      color: white;
      font-size: 1.1rem;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      border: 2px solid white;
      border-radius: 30px;
      transition: all 0.3s ease;

      &:hover {
        background: white;
        color: var(--primary-color);
      }
    }
  }

  .item-info {
    padding: 1.5rem;
  }

  .item-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  .item-tag {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    background: var(--primary-color);
    color: white;

    &.desktop-only {
      background: var(--secondary-color);
    }
  }
}

.showcase-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .modal-content {
    margin-top: var(--nav-height);
    position: relative;
    width: 90%;
    max-width: 1200px;
    height: 80vh;
    background: var(--bg-secondary);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
    z-index: 100000;
  }

  .close-button {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 25px;
    height: 25px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: rgb(201, 1, 1);
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
}

@media (max-width: 768px) {
  .showcase-container {
    padding: 1rem 0;

    &::before {
      height: 30vh;
      clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
    }
  }

  .showcase-header {
    padding: 3rem 1rem;

    .main-title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .showcase-grid {
    padding: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .showcase-item {
    .item-info {
      padding: 1rem;
    }

    .item-title {
      font-size: 1.1rem;
    }
  }

  .showcase-modal {
    padding: 1rem;

    .modal-content {
      width: 95%;
      height: 80vh;
    }
  }
}
</style>