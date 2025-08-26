import { createRouter, createWebHashHistory, Router } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      children: [
        {
          path: '/json',
          name: 'json',
          component: () => import('../views/JsonTool.vue')
        },
        {
          path: '/date',
          name: 'date',
          component: () => import('../views/DateTool.vue')
        },
        {
          path: '/hash',
          name: 'hash',
          component: () => import('../views/HashTool.vue')
        },
        {
          path: '/gen',
          name: 'generator',
          component: () => import('../views/GenetatorTool.vue')
        }
      ]
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('../views/Config.vue')
    }
  ]
}) as Router

export default router
