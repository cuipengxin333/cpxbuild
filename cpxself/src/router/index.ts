import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage/index.vue')
    }, {
      path: '/showcase',
      name: 'showcase',
      component: () => import('../views/ShowCase/index.vue'),
      children: [
        {
          path: 'unloadAnimation',
          name: 'unloadAnimation',
          component: () => import('../views/ShowCase/components/UnloadAnimation/index.vue')
        }
      ]
    }
  ]
})

export default router 