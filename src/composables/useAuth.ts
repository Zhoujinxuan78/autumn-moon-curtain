import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

function messageOf(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message)
  }
  return '操作失败，请重试'
}

export function useAuth() {
  const userStore = useUserStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const user = computed(() => userStore.profile)

  // 纯前端校验：比对环境变量中的管理员密码（私人项目，图省事）。
  // 如需同时校验邮箱，可在 .env 配置 VITE_ADMIN_EMAIL 并在此一并比较。
  async function signIn(_email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const adminPwd = (import.meta.env.VITE_ADMIN_PASSWORD as string) || 'admin'
      if (password !== adminPwd) {
        throw new Error('密码错误')
      }
      userStore.login()
      return true
    } catch (e) {
      error.value = messageOf(e)
      return false
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    userStore.logout()
  }

  return { loading, error, user, signIn, signOut }
}
