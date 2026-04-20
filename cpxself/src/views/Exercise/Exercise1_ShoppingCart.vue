<template>
  <div class="exercise-container">
    <h2>练习 1：基础购物车逻辑</h2>
    <div class="task-description">
      <h3>待实现逻辑：</h3>
      <ul>
        <li>1. 渲染商品列表，包含名称、单价、数量。</li>
        <li>2. 实现数量加减按钮，最小数量为 1。</li>
        <li>3. 实现删除功能。</li>
        <li>4. 实现单选和全选功能。</li>
        <li>5. 计算属性：计算已选中商品的总价和总数量。</li>
      </ul>
    </div>

    <!-- 练习代码开始 -->
    <div class="cart-box">
      <!-- 在此编写你的购物车 HTML 结构 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Product {
  id: number;
  name: string;
  price: number;
  count: number;
  selected: boolean;
}

const products = ref<Product[]>([
  { id: 1, name: 'Vue.js 核心技术', price: 99, count: 1, selected: false },
  { id: 2, name: 'TypeScript 进阶指南', price: 79, count: 1, selected: false },
  { id: 3, name: 'Vite 实战技巧', price: 59, count: 1, selected: false },
]);

// 1. 实现全选计算属性 (getter 和 setter)
const isAllSelected = computed({
  get: () => {
    return false; // 待实现
  },
  set: (val) => {
    // 待实现
  }
});

// 2. 实现总价计算属性
const totalPrice = computed(() => {
  return 0; // 待实现
});

// 3. 实现总数量计算属性
const totalCount = computed(() => {
  return 0; // 待实现
});

// 4. 实现加减数量方法
const changeCount = (id: number, step: number) => {
  // 待实现
};

// 5. 实现删除方法
const removeProduct = (id: number) => {
  // 待实现
};

</script>

<style scoped lang="scss">
.exercise-container {
  padding: 20px;

  h2,
  h3,
  li {
    color: var(--text-primary);
  }
}

.task-description {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.cart-box {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}
</style>
