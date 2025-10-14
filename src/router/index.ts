import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'AI诗歌鉴赏'
    }
  },
  {
    path: '/poetry',
    name: 'PoetryList',
    component: () => import('@/views/PoetryListView.vue'),
    meta: {
      title: '诗歌列表'
    }
  },
  {
    path: '/poetry/:id',
    name: 'PoetryDetail',
    component: () => import('@/views/PoetryDetailView.vue'),
    meta: {
      title: '诗歌详情'
    }
  },
  {
    path: '/create',
    name: 'CreatePoetry',
    component: () => import('@/views/CreatePoetryView.vue'),
    meta: {
      title: 'AI创作'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router