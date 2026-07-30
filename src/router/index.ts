import type { App } from 'vue'
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import { useUserStore } from '@/stores/user'

const DefaultLayout = () => import('@/layouts/DefaultLayout.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'parts',
        name: 'parts',
        component: () => import('@/views/parts/PartsView.vue'),
        meta: { title: '零配件' },
      },
      {
        path: 'parts/:id',
        name: 'part-detail',
        component: () => import('@/views/parts/PartDetailView.vue'),
        meta: { title: '配件详情' },
      },
      {
        path: 'custom',
        name: 'custom',
        component: () => import('@/views/custom/CustomView.vue'),
        meta: { title: '定制案例' },
      },
      {
        path: 'custom/:id',
        name: 'custom-detail',
        component: () => import('@/views/custom/CustomDetailView.vue'),
        meta: { title: '案例详情' },
      },
      {
        path: 'admin/login',
        name: 'admin-login',
        component: () => import('@/views/admin/LoginView.vue'),
        meta: { title: '管理员登录' },
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { title: '管理后台', requiresAdmin: true },
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/CategoriesAdmin.vue'),
        meta: { title: '分类管理', requiresAdmin: true },
      },
      {
        path: 'parts',
        name: 'admin-parts',
        component: () => import('@/views/admin/PartsAdmin.vue'),
        meta: { title: '配件管理', requiresAdmin: true },
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/admin/CustomAdmin.vue'),
        meta: { title: '定制案例管理', requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 路由守卫：管理后台需要管理员权限
router.beforeEach((to) => {
  if (to.meta.requiresAdmin) {
    const userStore = useUserStore()
    if (!userStore.isAdmin) {
      return { path: '/admin/login', query: { redirect: to.fullPath } }
    }
  }
  return true
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
