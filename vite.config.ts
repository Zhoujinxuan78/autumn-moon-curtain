import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // @ 指向 src 目录
    },
    // 强制单一 Vant / Vue 实例，避免重复打包导致的符号冲突
    dedupe: ['vant', 'vue'],
  },
  // 绝对路径：配合 createWebHistory() 的 history 路由部署到 Cloudflare Pages。
  // 若用 './'（相对路径），访问子路由(如 /admin/login)时浏览器会把 ./assets/* 解析成 /admin/assets/* → 404 → 白屏。
  base: '/',
  build: {
    // Vant 每个组件模块顶层都执行 `const [name, bem, t] = createNamespace(...)`。
    // Rollup 做模块拼接（scope-hoisting）时不会重命名解构出的 `bem` 绑定，
    // 一旦同一个 chunk 内出现 2 个以上 Vant 组件就会报
    // "The symbol 'bem' has already been declared"。
    // 解决办法：按 vant/es/<组件> 目录把每个组件拆成独立 chunk，
    // 保证任何输出块内最多只有一个 createNamespace 顶层声明，冲突自然消失。
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (id.includes('@supabase')) return 'supabase'
          if (/node_modules\/(vue|vue-router|pinia|@vue)\//.test(id)) return 'vue'
          if (id.includes('node_modules/vant/es')) {
            const m = id.match(/node_modules\/vant\/es\/([^/]+)/)
            return m ? `vant-${m[1]}` : 'vant-misc'
          }
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000, // 服务启动端口号
    open: true, // 服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
  },
})
