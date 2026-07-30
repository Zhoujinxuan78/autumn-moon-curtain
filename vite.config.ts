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
    // 不要手动把 Vant 拆成「每组件一个 chunk」：Vant 组件之间存在循环依赖
    // （picker-group ↔ picker），拆分成独立 chunk 会让 Rollup 在运行时产生
    // TDZ（Cannot access 'X' before initialization）崩溃导致白屏。
    // 使用 Vite 默认打包即可（dev 模式一直正常，证明默认处理对 Vant 是正确的）。
  },
  server: {
    host: '0.0.0.0',
    port: 3000, // 服务启动端口号
    open: true, // 服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
  },
})
