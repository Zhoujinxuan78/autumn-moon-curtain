import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(),
        AutoImport({
            resolvers: [VantResolver()],
        }),
        Components({
            resolvers: [VantResolver()],
        }),],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src') //  @ 指向 src 目录
        }
    },
    base: '/autumn-moon-curtain/', // 打包路径
    server: {
        host: '0.0.0.0',
        port: 3000, // 服务启动端口号
        open: true, // 服务启动时是否自动打开浏览器
        cors: true // 允许跨域
    }
});
//# sourceMappingURL=vite.config.js.map