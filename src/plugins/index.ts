import type { App } from 'vue'

import { installVant } from '@/plugins/vant'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'

export default {
  install(app: App<Element>) {
    installVant(app)
    // 路由
    setupRouter(app)
    // 状态管理
    setupStore(app)
  },
}
