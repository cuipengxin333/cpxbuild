import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../view/HomePage/index.vue')
    }, {
      path: '/showcase',
      name: 'showcase',
      component: () => import('../view/ShowCase/index.vue'),
      children: [
        {
          path: 'unloadAnimation',
          name: 'unloadAnimation',
          component: () => import('../view/ShowCase/components/UnloadAnimation/index.vue')
        }
      ]
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../view/ProjectsPage/index.vue')
    }, {
      path: '/projects/:id',
      name: 'projectDetali',
      component: () => import('../view/ProjectDetali/index.vue')
    }
  ]
})

export default router 