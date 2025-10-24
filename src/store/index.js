import { createPinia } from "pinia";
const store = createPinia();
// 全局注册 store
export function setupStore(app) {
    app.use(store);
}
// export * from './modules/global'
export { store };
//# sourceMappingURL=index.js.map