<template>
  <div class="exercise-container">
    <h2>练习 2：搜索过滤与防抖处理</h2>
    <div class="task-description">
      <h3>待实现逻辑：</h3>
      <ul>
        <li>1. 实时监听输入框内容。</li>
        <li>2. 实现防抖逻辑：用户停止输入 500ms 后才触发搜索过滤。</li>
        <li>3. 过滤列表内容：根据输入关键词模糊匹配用户名或邮箱。</li>
        <li>4. 交互：搜索为空时显示全部，搜索无结果时显示提示文案。</li>
      </ul>
    </div>

    <div class="search-box">
      <input type="text" placeholder="搜索用户名或邮箱..." class="search-input" />

      <ul class="user-list">
        <!-- 渲染过滤后的列表 -->
      </ul>

      <!-- 搜索无结果显示 -->
      <div class="no-result">暂无搜索结果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface User {
  id: number;
  username: string;
  email: string;
}

const allUsers: User[] = [
  { id: 1, username: 'ZhangSan', email: 'zhang@example.com' },
  { id: 2, username: 'LiSi', email: 'li@example.com' },
  { id: 3, username: 'WangWu', email: 'wang@test.com' },
  { id: 4, username: 'ZhaoLiu', email: 'zhao@demo.com' },
  { id: 5, username: 'SunQi', email: 'sun@work.com' },
];

const keyword = ref('');
const filteredUsers = ref<User[]>(allUsers);

// 待实现：防抖搜索逻辑
// 提示：可以使用 setTimeout 和 clearTimeout

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

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-list li {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

.no-result {
  text-align: center;
  color: #909399;
  padding: 20px;
}
</style>
