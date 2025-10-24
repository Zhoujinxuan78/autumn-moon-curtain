import { setupI18n } from "@/lang";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";
export default {
    install(app) {
        // 路由(router)
        setupRouter(app);
        // 状态管理(store)
        setupStore(app);
        // 国际化
        setupI18n(app);
    },
};
//# sourceMappingURL=index.js.map