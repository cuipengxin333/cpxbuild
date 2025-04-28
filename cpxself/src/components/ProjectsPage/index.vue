<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { Project } from "../../types/project";

const projects = ref<Project[]>([]);

// 没有预算，所以使用本地json文件
const getProjects = async () => {
  const res = await axios.get("/projectData.json");
  projects.value = res.data;
};

const goDetail = (id: number) => {
  window.open(`/projects/${id}`);
};

onMounted(() => {
  getProjects();
});
</script>

<template>
  <div class="projects-container">
    <h1 class="page-title">项目经验</h1>
    <div class="projects-grid">
      <article
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-image">
          <img :src="project.image" :alt="project.title" />
          <div class="project-overlay">
            <a :href="project.link" class="view-project">
              查看项目
              <svg
                class="arrow-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
        <div class="project-content">
          <h2 class="project-title">{{ project.title }}</h2>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.projects-container {
  width: 100%;
  min-height: calc(100vh - var(--nav-height));
  padding: 4rem;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.projects-grid {
  width: 100%;
  max-width: 1920px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin: 0 auto;
}

.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
  border: 1px solid var(--border-color);
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  backdrop-filter: blur(10px);
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.project-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-primary-rgb), 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.view-project {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--text-primary);
  border-radius: 2rem;
  transition: all 0.3s ease;
  transform: translateY(20px);
  opacity: 0;
  background: transparent;
}

.project-card:hover .view-project {
  transform: translateY(0);
  opacity: 1;
}

.view-project:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.project-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.project-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  flex: 1;
  font-weight: 400;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.tag {
  padding: 0.35rem 0.75rem;
  background: var(--bg-primary);
  color: var(--primary-color);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.tag:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.view-project:hover .arrow-icon {
  transform: translateX(4px);
}

.project-links {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.project-link {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.project-link:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .projects-container {
    padding: 2rem;
  }

  .page-title {
    margin-bottom: 2rem;
  }

  .project-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .projects-container {
    padding: 1.5rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .project-image {
    height: 200px;
  }

  .project-content {
    padding: 1.25rem;
  }

  .project-title {
    font-size: 1.25rem;
  }

  .project-description {
    font-size: 0.9rem;
  }
}
</style> 