import { createApp } from 'vue'
import '@/styles/reset.scss'
import '@/styles/style.css'
import '@/styles/theme.css'
import 'vant/lib/index.css'
import App from './App.vue'
import setupPlugins from '@/plugins'
import { useUserStore } from '@/stores/user'

async function main() {
  const app = createApp(App)
  app.use(setupPlugins)

  // 恢复登录态后再挂载，保证路由守卫能拿到用户角色
  const userStore = useUserStore()
  try {
    await userStore.init()
  } catch (err) {
    // 即使会话初始化失败（例如数据库未连接），也保证应用挂载，避免白屏
    console.error('[app] 初始化用户会话失败，但继续挂载应用：', err)
  }

  app.mount('#app')
}

main()
