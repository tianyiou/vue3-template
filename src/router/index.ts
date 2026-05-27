import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import requestManager from '@/utils/http/request-manager'

// 定义路由（每个路由都需要映射到一个组件）
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/test/test-list.vue'), // 懒加载
  },
  {
    path: '/test1',
    name: 'Test1',
    component: () => import('@/views/test/test1.vue'), // 懒加载
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

// 每次路由跳转前取消所有未完成的请求
router.beforeEach((to, from, next) => {
  requestManager.cancelAllRequest()
  next()
})

export default router
