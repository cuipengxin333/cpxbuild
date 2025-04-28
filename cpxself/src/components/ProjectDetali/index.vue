<template>
  <div class="project-detail-container">
    <div v-if="projectDetail && projectDetail.id" class="project-detail-card">
      <img
        v-if="projectDetail.image"
        :src="projectDetail.image"
        :alt="projectDetail.title"
        class="project-detail-image"
      />
      <div class="project-detail-content">
        <h1 class="project-detail-title">{{ projectDetail.title }}</h1>
        <div class="project-detail-tags">
          <span
            v-for="tag in projectDetail.tags"
            :key="tag"
            class="project-detail-tag"
          >
            {{ tag }}
          </span>
        </div>
        <p class="project-detail-desc">{{ projectDetail.description }}</p>
      </div>
    </div>
    <div v-else class="not-found">未找到该项目</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Project } from "../../types/project";

const route = useRoute();
// 获取路由参数
const id = route.params.id;
const projectDetail = ref<Project>({} as Project);

const getProjectById = async () => {
  const ids = Array.isArray(id) ? Number(id[0]) : Number(id);
  const res = await axios.get<Project[]>("/projectData.json");
  projectDetail.value = res.data.find((item: any) => item.id === ids);
  console.log(projectDetail.value);
  if (!projectDetail.value) {
    console.error("未找到对应项目");
  }
};

onMounted(() => {
  getProjectById();
});
</script>

<style scoped>
.project-detail-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.project-detail-card {
  background: var(--card-bg, #ffffff);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.project-detail-card:hover {
  transform: translateY(-4px);
}

.project-detail-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.project-detail-content {
  padding: 2rem;
}

.project-detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
  margin-bottom: 1rem;
}

.project-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.project-detail-tag {
  background: var(--tag-bg, #f3f4f6);
  color: var(--tag-text, #4b5563);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.project-detail-desc {
  color: var(--text-secondary, #4b5563);
  line-height: 1.6;
  font-size: 1.125rem;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary, #4b5563);
  font-size: 1.25rem;
}

/* 暗色模式样式 */
:root[class~="dark"] .project-detail-card {
  --card-bg: #1f2937;
  --border-color: #374151;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
  --tag-bg: #374151;
  --tag-text: #e5e7eb;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .project-detail-container {
    margin: 1rem auto;
  }

  .project-detail-image {
    height: 300px;
  }

  .project-detail-content {
    padding: 1.5rem;
  }

  .project-detail-title {
    font-size: 1.5rem;
  }

  .project-detail-desc {
    font-size: 1rem;
  }
}
</style>