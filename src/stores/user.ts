import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Profile } from '@/types'

// 私人项目：登录完全在前端完成，登录态存 localStorage。
// 校验逻辑在 useAuth.signIn 中比对 VITE_ADMIN_PASSWORD；数据库操作由 anon key + 关闭 RLS 直接完成。
const STORAGE_KEY = 'admin_auth'

export const useUserStore = defineStore('user', () => {
  const authenticated = ref(false)
  const profile = ref<Profile | null>(null)

  const isAuthenticated = computed(() => authenticated.value)
  const isAdmin = computed(() => authenticated.value)
  const isSuperAdmin = computed(() => profile.value?.role === 'super_admin')

  function buildProfile(): Profile {
    const email = (import.meta.env.VITE_ADMIN_EMAIL as string) || 'admin@local'
    return {
      id: 'local-admin',
      email,
      display_name: '管理员',
      avatar_url: null,
      role: 'super_admin',
      created_at: new Date().toISOString(),
    }
  }

  /** 应用启动时调用：从 localStorage 恢复登录态 */
  function init() {
    const ok = localStorage.getItem(STORAGE_KEY) === '1'
    authenticated.value = ok
    profile.value = ok ? buildProfile() : null
  }

  function login() {
    authenticated.value = true
    profile.value = buildProfile()
    localStorage.setItem(STORAGE_KEY, '1')
  }

  function logout() {
    authenticated.value = false
    profile.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    profile,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    init,
    login,
    logout,
  }
})
