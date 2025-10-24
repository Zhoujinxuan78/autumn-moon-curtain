import { createRouter, createWebHistory } from "vue-router";
const Layout = () => import("@/layout/Layout.vue");
// 静态路由
export const constantRoutes = [
    {
        path: "/",
        component: Layout,
        redirect: "/index",
        children: [
            {
                path: "index",
                name: "index",
                meta: {
                    keepAlive: true,
                    title: "Recharge",
                },
                component: () => import("@/views/index.vue"),
            },
            {
                path: "descriptions",
                name: "descriptions",
                meta: {
                    keepAlive: true,
                },
                component: () => import("@/views/Description.vue"),
            },
        ],
    },
    // {
    //   // 匹配不到时跳转到首页
    //   path: "/:pathMatch(.*)*",
    //   redirect: "/index",
    // },
];
/**
 * 创建路由
 */
const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        // 如果有缓存位置就恢复，否则保持当前位置
        if (savedPosition) {
            return savedPosition;
        }
        else {
            return false; //返回 false 表示保持当前滚动，不会回到头图
        }
    }
});
// 全局注册 router
export function setupRouter(app) {
    app.use(router);
}
export default router;
//# sourceMappingURL=index.js.map