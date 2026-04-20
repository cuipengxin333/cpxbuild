<template>
    <div class="exercise-container">
        <h2>练习 3：注册表单验证</h2>
        <div class="task-description">
            <h3>待实现逻辑：</h3>
            <ul>
                <li>1. 用户名：必填，长度 3-10 位。</li>
                <li>2. 邮箱：必填，需符合邮箱正则格式。</li>
                <li>3. 密码：必填，长度不少于 6 位。</li>
                <li>4. 确认密码：必填，必须与密码一致。</li>
                <li>5. 交互：实时显示每个字段的错误提示，只有全部合法时“提交”按钮才可用。</li>
            </ul>
        </div>

        <form class="register-form" @submit.prevent="handleSubmit">
            <div class="form-item">
                <label>用户名：</label>
                <input type="text" />
                <span class="error-msg">错误提示占位</span>
            </div>

            <!-- 补充邮箱、密码、确认密码字段 -->

            <button type="submit" class="submit-btn">注册</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';

const formData = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

// 待实现：计算每个字段是否合法的逻辑
// 待实现：计算整个表单是否可提交的逻辑

const handleSubmit = () => {
    alert('提交成功！');
};
</script>

<style scoped>
.exercise-container {
    padding: 20px;

    h2, h3, li {
        color: var(--text-primary);
    }
}

.task-description {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.form-item {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    label {
        margin-bottom: 5px;
        color: var(--text-primary);
    }

    input {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    width: 300px;
}
}

.error-msg {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
}



.submit-btn {
    background: #409eff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.submit-btn:disabled {
    background: #a0cfff;
    cursor: not-allowed;
}
</style>
