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
        }
      ]
    }
  ]
}) as Router

export default router
