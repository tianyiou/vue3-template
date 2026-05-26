import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 定义路由（每个路由都需要映射到一个组件）
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Test.vue'), // 懒加载
  },
  // 404 路由（可选）
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFound.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
