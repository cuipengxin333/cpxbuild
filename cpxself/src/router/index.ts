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
    }, {
      path: '/aichat',
      name: 'aichat',
      component: () => import('../views/AIChat/index.vue')
    }, {
      path: '/plaintext',
      name: 'plaintext',
      component: () => import('../views/PlainText/index.vue')
    }, {
      path: '/exercise',
      name: 'exercise',
      component: () => import('../views/Exercise/index.vue')
    }, {
      path: '/exercise/1',
      name: 'exercise-1',
      component: () => import('../views/Exercise/Exercise1_ShoppingCart.vue')
    }, {
      path: '/exercise/2',
      name: 'exercise-2',
      component: () => import('../views/Exercise/Exercise2_SearchDebounce.vue')
    }, {
      path: '/exercise/3',
      name: 'exercise-3',
      component: () => import('../views/Exercise/Exercise3_FormValidation.vue')
    }, {
      path: '/exercise/4',
      name: 'exercise-4',
      component: () => import('../views/Exercise/Exercise4_DynamicTabs.vue')
    }
  ]
})

export default router 