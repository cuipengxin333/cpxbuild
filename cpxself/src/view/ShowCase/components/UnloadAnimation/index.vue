<template>
  <div
    class="unload"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <p class="title">是否要卸载软件？</p>
    <div
      class="face"
      :style="{
        background: `linear-gradient(to bottom, hsl(${huedeg}deg, 100%, 65.29%), rgb(255,223,78))`,
      }"
    >
      <div class="eye-left">
        <div class="pupil-left" ref="pupilLeft"></div>
      </div>
      <div class="eye-right">
        <div class="pupil-right" ref="pupilRight"></div>
      </div>
      <div
        class="pink-left"
        :style="{ opacity: opacity, top: top + '%', left: left + '%' }"
      ></div>
      <div
        class="pink-right"
        :style="{ opacity: opacity, top: top + '%', left: left1 + '%' }"
      ></div>
      <div
        class="mouth"
        :style="{
          borderRadius: `${mouthTop}px ${mouthTop}px ${mouthBottom}px ${mouthBottom}px`,
          top: top2 + '%',
        }"
      >
        <div class="tooth"></div>
        <div class="smile"></div>
      </div>
    </div>
    <div class="bottom">
      <button class="cancel" @click="handleCancel">保留</button>
      <button class="confirm" @click="handleConfirm">卸载</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";

const { appContext } = getCurrentInstance();

// 背景颜色变化
const huedeg = ref(0);

// 脸颊
const opacity = ref(0);
const top = ref(48);
const left = ref(10);
const left1 = ref(70);

// 嘴巴
const mouthTop = ref(5);
const mouthBottom = ref(75);
const top2 = ref(63);

const container = ref(null);
const pupilLeft = ref(null);
const pupilRight = ref(null);

// 定义"当前值"和"目标值"
const state = {
  // 目标值
  target: {
    opacity: 1,
    top: 48,
    left: 10,
    left1: 70,
    mouthTop: 5,
    mouthBottom: 75,
    top2: 63,
    huedeg: 50,
    leftPupilX: 0,
    leftPupilY: 0,
    rightPupilX: 0,
    rightPupilY: 0,
  },
  // 当前值
  current: {
    opacity: 1,
    top: 48,
    left: 10,
    left1: 70,
    mouthTop: 5,
    mouthBottom: 75,
    top2: 63,
    huedeg: 50,
    leftPupilX: 0,
    leftPupilY: 0,
    rightPupilX: 0,
    rightPupilY: 0,
  },
};

let animationFrameId = null;

// 缓动函数
function animate() {
  let needUpdate = false;
  for (const key in state.current) {
    const c = state.current[key];
    const t = state.target[key];
    // 线性插值，0.2 可调整为更大更快
    const next = c + (t - c) * 0.2;
    if (Math.abs(next - t) > 0.1) needUpdate = true;
    state.current[key] = next;
  }
  // 更新 DOM
  opacity.value = state.current.opacity;
  top.value = state.current.top;
  left.value = state.current.left;
  left1.value = state.current.left1;
  mouthTop.value = state.current.mouthTop;
  mouthBottom.value = state.current.mouthBottom;
  top2.value = state.current.top2;
  huedeg.value = state.current.huedeg;

  if (pupilLeft.value && pupilRight.value) {
    pupilLeft.value.style.transform = `translate(-50%, -50%) translate(${state.current.leftPupilX}px, ${state.current.leftPupilY}px)`;
    pupilRight.value.style.transform = `translate(-50%, -50%) translate(${state.current.rightPupilX}px, ${state.current.rightPupilY}px)`;
  }

  if (needUpdate) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    animationFrameId = null;
  }
}

// 鼠标移动时只更新目标值
const handleMouseMove = (e) => {
  const face = document.querySelector(".unload");
  const rect = face.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  const clampedX = Math.max(0, Math.min(x, width));
  const percent = clampedX / width;

  state.target.opacity = 1 - percent;
  state.target.top = 48 + percent * 2;
  state.target.top2 = 63 + percent * 2;
  state.target.left = 10 + percent * 2;
  state.target.left1 = 70 + percent * 2;
  state.target.huedeg = Math.round(50 + percent * (150 - 50));
  state.target.mouthTop = percent * 80;
  state.target.mouthBottom = 80 - state.target.mouthTop;

  // 眼球
  const eyeLeft = document.querySelector(".eye-left");
  const eyeRight = document.querySelector(".eye-right");
  const eyeLeftRect = eyeLeft.getBoundingClientRect();
  const eyeLeftCenterX = eyeLeftRect.left + eyeLeftRect.width / 2;
  const eyeLeftCenterY = eyeLeftRect.top + eyeLeftRect.height / 2;
  const eyeRightRect = eyeRight.getBoundingClientRect();
  const eyeRightCenterX = eyeRightRect.left + eyeRightRect.width / 2;
  const eyeRightCenterY = eyeRightRect.top + eyeRightRect.height / 2;

  // 左眼
  const leftMouseX = e.clientX - eyeLeftCenterX;
  const leftMouseY = e.clientY - eyeLeftCenterY;
  const leftDistance = Math.sqrt(
    leftMouseX * leftMouseX + leftMouseY * leftMouseY
  );
  const leftMaxDistance = 15;
  const leftScale = Math.min(1, leftMaxDistance / leftDistance);
  state.target.leftPupilX = leftMouseX * leftScale;
  state.target.leftPupilY = leftMouseY * leftScale;

  // 右眼
  const rightMouseX = e.clientX - eyeRightCenterX;
  const rightMouseY = e.clientY - eyeRightCenterY;
  const rightDistance = Math.sqrt(
    rightMouseX * rightMouseX + rightMouseY * rightMouseY
  );
  const rightMaxDistance = 15;
  const rightScale = Math.min(1, rightMaxDistance / rightDistance);
  state.target.rightPupilX = rightMouseX * rightScale;
  state.target.rightPupilY = rightMouseY * rightScale;

  // 启动动画
  if (!animationFrameId) animate();
};

const handleMouseLeave = () => {
  state.target = {
    opacity: 1,
    top: 48,
    left: 10,
    left1: 70,
    mouthTop: 5,
    mouthBottom: 75,
    top2: 63,
    huedeg: 50,
    leftPupilX: 0,
    leftPupilY: 0,
    rightPupilX: 0,
    rightPupilY: 0,
  };
  if (!animationFrameId) animate();
};

const handleCancel = () => {
  appContext.config.globalProperties.$toast({
    message: "保留成功",
    type: "success",
    duration: 3000,
  });
};

const handleConfirm = () => {
  appContext.config.globalProperties.$toast({
    message: "卸载成功",
    type: "error",
    duration: 3000,
  });
};

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style lang="scss" scoped>
.unload {
  width: 100%;
  height: 100%;

  .title {
    text-align: center;
    font-size: 1.2rem;
    line-height: 4rem;
    color: var(--text-primary);
  }

  .face {
    width: 280px;
    height: 280px;
    border-radius: 140px;
    background-color: #e6c372;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: relative;
    border: 2px solid #e7c472;
    box-shadow: 0px 0px 10px var(--text-primary);

    .eye-left {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: #fff;
      position: absolute;
      top: 30%;
      left: 22%;

      .pupil-left {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        background-color: #442211;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
      }
    }

    .eye-right {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: #fff;
      position: absolute;
      top: 30%;
      left: 54%;

      .pupil-right {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        background-color: #442211;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
      }
    }

    .pink-left {
      width: 50px;
      height: 30px;
      border: 2px solid #d7ad69;
      background-color: #f1b380;
      border-radius: 50%;
      position: absolute;
      top: 48%;
      left: 10%;
    }

    .pink-right {
      width: 50px;
      height: 30px;
      border: 2px solid #d7ad69;
      background-color: #f1b380;
      border-radius: 50%;
      position: absolute;
      top: 48%;
      left: 70%;
    }

    .mouth {
      position: absolute;
      width: 150px;
      height: 70px;
      background-color: #aa3333;
      border: 2px solid rgb(122, 3, 3);
      border-radius: 5px 5px 75px 75px;
      top: 63%;
      left: 23%;
      position: relative;
      overflow: hidden;

      .tooth {
        position: absolute;
        width: 30px;
        height: 20px;
        background-color: #fff;
        border-radius: 0px 0px 5px 5px;
        top: 14%;
        left: 60%;
        transform: translate(-50%, -50%);
      }

      .smile {
        position: absolute;
        width: 80px;
        height: 30px;
        background-color: #882929;
        border-radius: 40px 40px 0px 0px;
        bottom: 0;
        left: 10%;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    width: 80%;
    position: absolute;
    bottom: 5rem;
    left: 10%;

    button {
      width: 6rem;
      height: 3rem;
      border-radius: 10px;
      border: none;
      font-size: 1.2rem;
      color: #fff;
      letter-spacing: 0.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cancel {
      background-color: #66aa44;
    }

    .cancel:hover {
      cursor: pointer;
      background-color: #81c061;
    }

    .confirm {
      background-color: #aa4433;
    }

    .confirm:hover {
      cursor: pointer;
      background-color: #c85a48;
    }
  }
}
</style>
