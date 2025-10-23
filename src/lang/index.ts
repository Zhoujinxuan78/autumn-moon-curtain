import { watchEffect, type App } from "vue";
import { createI18n } from "vue-i18n";
import _ from 'lodash';
import zhLocale from "./packages/zh-cn";
import enLocale from "./packages/en";
import arLocale from "./packages/ar";
import trLocale from "./packages/tr";
import thLocale from "./packages/th";
import hiLocale from "./packages/hi";
import taLocale from "./packages/ta";
import urLocale from "./packages/ur";
// import { useGlobalStoreHook } from "@/store";
// import locale from "@mono/ui/locale";

const messages = {
  "zh": {
    ...zhLocale,
  },
  "en": {
    ...enLocale,
  },
  "ar":{
    ...arLocale,
  },
  "tr":{
    ...trLocale,
  },
  "th":{
    ...thLocale,
  },
  "hi":{
    ...hiLocale,
  },
  "ta":{
    ...taLocale,
  },
  "ur":{
    ...urLocale,
  }
};
const i18n = createI18n({
  legacy: false,
  // locale: useGlobalStoreHook().locale,
  messages: _.merge(_, messages),
  globalInjection: true,
  fallbackLocale: "en",
});
// watchEffect(() => {
//   const lang = useGlobalStoreHook().locale;
//   i18n.global.locale.value = lang as any;
// })

// 全局注册 i18n
export function setupI18n(app: App<Element>) {
  app.use(i18n);
}
export default i18n;
