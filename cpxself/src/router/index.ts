import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      // 强制所有跳转都滚到顶部
      return { top: 0, left: 0, behavior: 'auto' };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage/index.vue')
    }, {
      path: '/oejts32',
      name: 'oejts32',
      component: () => import('../views/OEJTS32/index.vue')
    }, {
      path: '/oejts32/result',
      name: 'oejts32Result',
      component: () => import('../views/OEJTS32/ResultPage.vue')
    }, {
      path: '/toolbox',
      name: 'toolbox',
      component: () => import('../views/ToolBox/index.vue')
    }
  ]
})

export default router 