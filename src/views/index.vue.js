import { ref, } from 'vue';
import LOGO from '@/assets/logo_ic.png';
import { showToast } from 'vant';
import { tabNames } from '@/constants';
import FinishedSample from '@/components/FinishedSample.vue';
import GameCoinsFaq from '@/components/IncomeFaq.vue';
import RechargeFaq from '@/components/RechargeFaq.vue';
const active = ref(0);
const value = ref('');
const onSearch = () => showToast('搜索成功！');
const onClickButton = () => {
    showToast(`当前输入：${value.value}`);
};
// 这里定义每个 tab 对应的组件
const getTabComponent = (index) => {
    switch (index) {
        case 0:
            console.log('FinishedSample');
            return FinishedSample;
        case 1:
            return GameCoinsFaq;
        case 2:
            return RechargeFaq;
        case 3:
            return RechargeFaq;
        default:
            return null;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['custom-search']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-search']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-tabs']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative flex h-screen w-[750px] flex-col" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative top-2 flex w-full flex-row items-center justify-center" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ class: "h-[66px] w-[63px]" },
    src: (__VLS_ctx.LOGO),
    alt: "logo",
});
// @ts-ignore
[LOGO,];
const __VLS_0 = {}.VanSearch;
/** @type {[typeof __VLS_components.VanSearch, typeof __VLS_components.vanSearch, typeof __VLS_components.VanSearch, typeof __VLS_components.vanSearch, ]} */ ;
// @ts-ignore
VanSearch;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onSearch': {} },
    ...{ class: "custom-search w-[486px]" },
    modelValue: (__VLS_ctx.value),
    showAction: true,
    placeholder: "请输入搜索关键词",
    shape: "round",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSearch': {} },
    ...{ class: "custom-search w-[486px]" },
    modelValue: (__VLS_ctx.value),
    showAction: true,
    placeholder: "请输入搜索关键词",
    shape: "round",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
const __VLS_6 = ({ search: {} },
    { onSearch: (__VLS_ctx.onSearch) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[value, onSearch,];
{
    const { action: __VLS_8 } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.onClickButton) },
        ...{ class: "text-[32px]" },
    });
    // @ts-ignore
    [onClickButton,];
}
var __VLS_3;
const __VLS_9 = {}.VanTabs;
/** @type {[typeof __VLS_components.VanTabs, typeof __VLS_components.vanTabs, typeof __VLS_components.VanTabs, typeof __VLS_components.vanTabs, ]} */ ;
// @ts-ignore
VanTabs;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    modelValue: (__VLS_ctx.active),
    swipeable: (true),
    ...{ class: "custom-tabs relative top-[50px]" },
    color: "#00E0D7",
    titleActiveColor: "#222222",
    titleInactiveColor: "#AAAAAA",
    sticky: true,
}));
const __VLS_11 = __VLS_10({
    modelValue: (__VLS_ctx.active),
    swipeable: (true),
    ...{ class: "custom-tabs relative top-[50px]" },
    color: "#00E0D7",
    titleActiveColor: "#222222",
    titleInactiveColor: "#AAAAAA",
    sticky: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const { default: __VLS_13 } = __VLS_12.slots;
// @ts-ignore
[active,];
for (const [item, key, index] of __VLS_getVForSourceType((__VLS_ctx.tabNames))) {
    // @ts-ignore
    [tabNames,];
    const __VLS_14 = {}.VanTab;
    /** @type {[typeof __VLS_components.VanTab, typeof __VLS_components.vanTab, typeof __VLS_components.VanTab, typeof __VLS_components.vanTab, ]} */ ;
    // @ts-ignore
    VanTab;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
        key: (key),
    }));
    const __VLS_16 = __VLS_15({
        key: (key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const { default: __VLS_18 } = __VLS_17.slots;
    {
        const { title: __VLS_19 } = __VLS_17.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ style: ({ fontSize: '16px', fontWeight: 'bold' }) },
        });
        (item);
    }
    const __VLS_20 = ((__VLS_ctx.getTabComponent(Number(index))));
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "relative top-[30px] pb-[50px]" },
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "relative top-[30px] pb-[50px]" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [getTabComponent,];
    var __VLS_17;
}
var __VLS_12;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[750px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[66px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[63px]']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-search']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[486px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[32px]']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['top-[50px]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['top-[30px]']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-[50px]']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map