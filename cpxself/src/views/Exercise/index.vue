<template>
    <div class="exercise">
        <div class="exercise-header">
            <h2>Vue 业务交互练习题</h2>
            <p class="subtitle">通过以下练习，巩固 Vue 3 Composition API 的核心用法。</p>
        </div>

        <div class="exercise-list">
            <div v-for="ex in exercises" :key="ex.file" class="exercise-card" @click="goToExercise(ex.id)">
                <h3>{{ ex.title }}</h3>
                <p>{{ ex.desc }}</p>
                <code class="file-path">文件：{{ ex.file }}</code>
                <div class="logic-list">
                    <strong>练习重点：</strong>
                    <ul>
                        <li v-for="point in ex.points" :key="point">{{ point }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const exercises = [
    {
        id: 1,
        title: '1. 购物车交互逻辑',
        desc: '实现商品的增删、全选、总价计算等核心功能。',
        file: 'Exercise1_ShoppingCart.vue',
        points: ['computed 状态派生', '列表渲染与删除', '全选与反选逻辑']
    },
    {
        id: 2,
        title: '2. 搜索过滤与防抖',
        desc: '实现列表的实时搜索过滤，并处理防抖，提升性能。',
        file: 'Exercise2_SearchDebounce.vue',
        points: ['watch 监听输入', 'setTimeout/clearTimeout 防抖', '模糊匹配过滤']
    },
    {
        id: 3,
        title: '3. 注册表单验证',
        desc: '实现多字段表单验证，并根据验证结果动态禁用按钮。',
        file: 'Exercise3_FormValidation.vue',
        points: ['reactive 响应式对象', '正则校验逻辑', '计算属性控制提交状态']
    },
    {
        id: 4,
        title: '4. 动态标签页交互',
        desc: '实现标签页切换、组件通信与数据保留。',
        file: 'Exercise4_DynamicTabs.vue',
        points: ['动态组件 <component :is>', '组件间数据共享', '标签页切换逻辑']
    }
];

const goToExercise = (id: number) => {
    router.push(`/exercise/${id}`);
};
</script>

<style scoped>
.exercise {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
}

.exercise-header {
    color: var(--text-primary);
    text-align: center;
    margin-bottom: 40px;
}

.subtitle {
    color: var(--text-secondary);    
    margin-top: 10px;
}

.exercise-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
}

.exercise-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.exercise-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #409eff;
}

.exercise-card h3,
.exercise-card p {
    margin: 0 0 10px 0;
    color: #333;
}

.file-path {
    display: block;
    background: #f8f8f8;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
    margin: 12px 0;
    color: #409eff;
}

.logic-list {
    margin-top: 15px;
    font-size: 14px;
    color: #666;
}

.logic-list ul {
    margin: 8px 0 0 0;
    padding-left: 20px;
    color: #666;
}

.logic-list li {
    margin-bottom: 4px;
}
</style>
