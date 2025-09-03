import { createRouter, createWebHashHistory, Router } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('../views/Home.vue'),
          redirect: '/json',
          children: [
            {
              path: '/json',
              name: 'json',
              component: () => import('../views/JsonTool.vue')
            },
            {
              path: '/date',
              name: 'date',
              component: () => import('../views/DateTool.vue'),
              children: [
                {
                  path: '/date/timestamp',
                  name: 'timestamp',
                  component: () => import('../views/Timestamp.vue')
                },
                {
                  path: '/date/calculator',
                  name: 'dateCalculator',
                  component: () => import('../views/DateCalculator.vue')
                }
              ]
            },
            {
              path: '/hash',
              name: 'hash',
              component: () => import('../views/HashTool.vue')
            },
            {
              path: '/gen',
              name: 'generator',
              component: () => import('../views/GenetatorTool.vue'),
              children: [
                {
                  path: '/gen/randomCh',
                  name: 'randomCharacter',
                  component: () => import('../views/GenerateCharacter.vue')
                },
                {
                  path: '/gen/uuid',
                  name: 'uuid',
                  component: () => import('../views/GenerateUUID.vue')
                }
              ]
            }
          ]
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
