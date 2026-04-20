<template>
  <div class="exercise-container">
    <h2>练习 4：动态标签页与组件交互</h2>
    <div class="task-description">
      <h3>待实现逻辑：</h3>
      <ul>
        <li>1. 实现三个标签页切换：基础信息、账户设置、安全隐私。</li>
        <li>2. 动态组件：点击不同标签，下方显示对应的子组件内容。</li>
        <li>3. 数据持久化模拟：在“账户设置”中修改用户名，切换标签后内容依然保留。</li>
        <li>4. 事件通信：子组件修改数据后，通知父组件显示“保存成功”的提示。</li>
      </ul>
    </div>

    <div class="tabs-header">
      <button v-for="tab in tabs" :key="tab.key" @click="currentTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <!-- 动态渲染子组件 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabs = [
  { key: 'info', label: '基础信息' },
  { key: 'settings', label: '账户设置' },
  { key: 'security', label: '安全隐私' },
];

const currentTab = ref('info');

// 待实现：子组件的定义与动态切换逻辑
</script>

<style scoped>
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

.tabs-header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs-header button {
  padding: 8px 16px;
  cursor: pointer;
}

.tab-content {
  border: 1px solid #ddd;
  padding: 20px;
  min-height: 200px;
}
</style>
