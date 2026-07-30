import type { App } from 'vue'
import Vant from 'vant'

// 全量注册 Vant 组件。Vant 的 es/index.mjs 默认导出即 `{ install, version }` 插件对象，
// 全量注册可保证模板里出现的任何 <van-*> 都能解析，无需逐个维护注册表。
// 组件样式在 src/main.ts 中统一 `import 'vant/lib/index.css'` 引入。
export function installVant(app: App) {
  app.use(Vant)
}
