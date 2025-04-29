import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage/index.vue'
import ShowCase from '../components/ShowCase/index.vue'
import ProjectsPage from '../components/ProjectsPage/index.vue'
import ProjectDetali from '../components//ProjectDetali/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    }, {
      path: '/showcase',
      name: 'showcase',
      component: ShowCase
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsPage
    }, {
      path: '/projects/:id',
      name: 'projectDetali',
      component: ProjectDetali
    }
  ]
})

export default router 