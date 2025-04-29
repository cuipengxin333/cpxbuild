<template>
  <div class="showcase-container">
    <div class="top">
      <p class="title">分享一些有意思的小效果</p>
    </div>
    <div class="content"></div>
  </div>
</template>

<script setup>
</script>

<style lang="scss">
.showcase-container {
  width: 100%;
  height: 500px;
  background-color: var(--bg-color);

  .top {
    width: 80%;
    min-width: 300px;
    height: 3rem;
    line-height: 3rem;
    margin: 2rem auto;
    border-radius: 5px;
    position: relative;
    overflow: hidden; // 防止伪元素溢出
    background-color:var(--bg-color);

    .title {
      position: absolute;
      font-size: 1.2rem;
      color: var(--text-primary);
      z-index: 2;
      text-align: center;
      width: 100%;
    }

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: 0%;
      width: 100%;
      height: 300%;
      background: conic-gradient(
        from 0deg,
        #8c84c5,
        #a0fcdd,
        #81c0ff,
        #af78e1,
        #73d7d9,
        #8a83bc
      );
      animation: rotateBorder 4s linear infinite;
      z-index: 1;
    }

    &::after {
      content: "";
      position: absolute;
      top: 4px;
      left: 4px;
      right: 4px;
      bottom: 4px;
      background: var(--bg-primary);
      border-radius: 4px;
      z-index: 1;
    }
  }

  .content {
    width: 80%;
    height: 400px;
    margin: 2rem auto;
    background-color: #b29cef;
  }
}

@keyframes rotateBorder {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 768px) {
}

@media screen and (max-width: 576px) {
}
</style>