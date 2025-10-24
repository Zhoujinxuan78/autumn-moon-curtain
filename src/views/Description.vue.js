import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { finishSampleData } from '@/constants';
import Bg from '@/assets/round_bg.png';
import FinishedItem from '@/components/finishedItem.vue';
const router = useRouter();
const route = useRoute();
const rootName = 'index';
const id = route.query.data || 1;
const itemInfo = finishSampleData.find(sample => sample.id === Number(id));
const descriptionDataList = computed(() => {
    console.log('itemInfo', itemInfo.descriptionData);
    return itemInfo ? itemInfo.descriptionData : '';
});
const currentImage = ref(itemInfo.image);
function onNavBackClick() {
    // if (route.name === rootName) {
    //     closeWindow()
    //     return
    // }
    console.log(window.history.length);
    if (window.history.length > 1) {
        router.go(-1);
    }
}
function onItemClick(descInfo) {
    currentImage.value = descInfo;
}
const masonry = ref(null);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative flex flex-col w-[750px] h-screen bg-[#E9ECF3] overflow-x-hidden" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative left-[50%] translate-x-[-50%] top-[-90px] w-[1005px] h-[1005px] bg-center bg-no-repeat bg-cover flex-shrink-0 " },
    ...{ style: ({ backgroundImage: `url(${__VLS_ctx.Bg})` }) },
});
// @ts-ignore
[Bg,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ onClick: (__VLS_ctx.onNavBackClick) },
    src: "../assets/back_ic.png",
    ...{ class: "absolute top-[20px] left-[20px] w-[70px] h-[70px] z-10" },
});
// @ts-ignore
[onNavBackClick,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "absolute flex justify-center items-center w-full top-0 h-[865px]" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.currentImage),
    ...{ class: "max-h-[600px] rounded-[50px]" },
});
// @ts-ignore
[currentImage,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "absolute flex flex-col top-[765px] w-full pb-10" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex flex-row gap-[20px] flex-wrap justify-center items-center w-full " },
});
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.descriptionDataList))) {
    // @ts-ignore
    [descriptionDataList,];
    /** @type {[typeof FinishedItem, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(FinishedItem, new FinishedItem({
        ...{ 'onOnItemClick': {} },
        key: (index),
        finishedItem: (item),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onOnItemClick': {} },
        key: (index),
        finishedItem: (item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ onItemClick: {} },
        { onOnItemClick: (__VLS_ctx.onItemClick) });
    // @ts-ignore
    [onItemClick,];
    var __VLS_2;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative flex flex-row w-full mt-[20px] justify-between px-[50px]" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "relative text-[42px] font-bold" },
});
(__VLS_ctx.itemInfo.title);
// @ts-ignore
[itemInfo,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "relative mt-[20px] text-[40px] font-bold text-[#274EA3]" },
});
(__VLS_ctx.itemInfo.price);
// @ts-ignore
[itemInfo,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative flex flex-row w-full items-center px-[50px] gap-[10px]" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "text-[32px] font-[600] mt-[5px]" },
});
(__VLS_ctx.itemInfo.starNumber);
// @ts-ignore
[itemInfo,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "text-[32px] text-[#A2A2A2] font-[600] mt-[5px]" },
});
(__VLS_ctx.itemInfo.Exposure);
// @ts-ignore
[itemInfo,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "relative text-[42px] font-bold w-full px-[50px] mt-[20px]" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative text-[32px] text-[#4A4A4A] font-normal w-full px-[50px] mt-[10px] leading-[48px]" },
});
(__VLS_ctx.itemInfo.productDescription);
// @ts-ignore
[itemInfo,];
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[750px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#E9ECF3]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['left-[50%]']} */ ;
/** @type {__VLS_StyleScopedClasses['translate-x-[-50%]']} */ ;
/** @type {__VLS_StyleScopedClasses['top-[-90px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[1005px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[1005px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-no-repeat']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-[20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['left-[20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[70px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[70px]']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[865px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[600px]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-[50px]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['top-[765px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-[20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-[20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-[50px]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[42px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-[20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[40px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#274EA3]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-[50px]']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[32px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-[600]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-[5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[32px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#A2A2A2]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-[600]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-[5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[42px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-[50px]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-[20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[32px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#4A4A4A]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-[50px]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-[48px]']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=Description.vue.js.map