# 八爪鱼 - 个人空间 & MBTI 人格测试

一个基于 Vue 3 + TypeScript + Vite 构建的现代化个人展示空间，集成了深度 MBTI 人格测试功能。

## 🌟 功能特点

- **MBTI 32 题人格测试**：
  - 基于 [OpenJung](https://openjung.org/zh) API 的专业人格分析。
  - 响应式进度条，支持滚动吸顶并自动切换精简模式。
  - 精美的人格分析结果页，包含维度对比、核心优势、代表人物等。
  - 支持测试结果一键复制链接分享。
- **个性化首页**：
  - 现代化 UI 设计，支持深色/浅色模式切换（带平滑过渡动画）。
  - 智能引导气泡，基于 SessionStorage 的会话提醒功能。
- **丝滑交互**：
  - 全局 Toast 提示插件。
  - 路由跳转自动置顶。
  - 基于 CSS 变量的动态主题色适配。

## 🛠️ 技术栈

- **前端框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **编程语言**：TypeScript
- **状态管理**：Reactive API (简洁版 Store)
- **样式处理**：SCSS / CSS Variables
- **网络请求**：Axios
- **路由管理**：Vue Router

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

## 📄 接口参考
本项目 MBTI 测试接口参考自 [OpenJung](https://openjung.org/zh)。

## 📝 开源协议
MIT License
