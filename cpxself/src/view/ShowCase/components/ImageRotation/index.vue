<template>
  <div class="image-rotation">
    <section>
      <div>
        <img
        style="width: 150%"
          src="https://ts1.tc.mm.bing.net/th/id/OIP-C.uuMRp41SjL9ukaBDDBWz5wHaNK?cb=iwp1&rs=1&pid=ImgDetMain"
        />
      </div>
      <div>
        <img
        
          src="https://ts4.tc.mm.bing.net/th/id/OIP-C.FMFfJ3tryQ0FC2GNqyyV9AHaIv?cb=iwp1&rs=1&pid=ImgDetMain"
        />
      </div>
      <div>
        <img
        
          src="https://ts4.tc.mm.bing.net/th/id/OIP-C.vXOLt9q2aexqt89FzVPs2wHaJQ?cb=iwp1&rs=1&pid=ImgDetMain"
        />
      </div>
      <div>
        <img
          style="width: 200%"
          src="https://pic4.zhimg.com/v2-efd4f4517d5bdb43858a04f7e4ff5f7f_r.jpg"
        />
      </div>
      <div>
        <img
          style="width: 200%"
          src="https://i5.3conline.com/images/piclib/201202/15/batch/1/126479/13293180670077k3igrywok.jpg"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.image-rotation {
  width: 100%;
  height: 100%;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;

  section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    width: 400px;
    height: 400px;
    overflow: hidden;
    position: relative;
    grid-template-areas:
      "TL TL TR"
      "BL CE TR"
      "BL BR BR";
    animation: rotate 10s linear infinite;
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 5px solid #696969;
    overflow: hidden;

    img {
      width: 300%;
      animation: rotate 10s linear infinite reverse;
    }
  }
  div:nth-child(1) {
    grid-area: TL;
  }
  div:nth-child(2) {
    grid-area: TR;
  }
  div:nth-child(3) {
    grid-area: BL;
  }
  div:nth-child(4) {
    grid-area: CE;
  }
  div:nth-child(5) {
    grid-area: BR;
  }
}

@keyframes rotate {
  to {
    transform: rotate(1turn);
  }
}

@media screen and (max-width: 768px) {
  .image-rotation {
    section {
      width: 260px;
      height: 260px;
      gap: 5px;
    }
  }
}
</style>