import { createApp } from "vue";
import "@/styles/reset.scss";
import "@/styles/style.css";
import App from "./App.vue";
import setupPlugins from "@/plugins";
// import { getLanguageCode } from "@mono/bridge";
// import { useGlobalStore } from "./store";
import 'vant/lib/index.css';
import { useCurrentLang } from 'vant';
import { Popup, Button, Swipe, SwipeItem, ConfigProvider } from 'vant';
async function main() {
    const app = createApp(App);
    app.use(setupPlugins);
    app.use(Popup);
    app.use(Button);
    app.use(Swipe);
    app.use(SwipeItem);
    app.use(ConfigProvider);
    const lang = (useCurrentLang().value);
    // useGlobalStore().setAppName(lang);
    if (lang == "ar" || lang == "ur" || lang === 'fa') {
        document.documentElement.setAttribute("dir", "rtl");
    }
    else {
        document.documentElement.setAttribute("dir", "ltr");
    }
    // 注册插件
    app.mount("#app");
}
if (import.meta.env.VUE_APP_STAGING !== "prod") {
    const erudaDom = document.createElement("script");
    erudaDom.src = "https://cdnjs.cloudflare.com/ajax/libs/eruda/3.4.1/eruda.min.js";
    document.body.appendChild(erudaDom);
    erudaDom.onload = () => {
        // window.eruda.init();
    };
}
main();
//# sourceMappingURL=main.js.map