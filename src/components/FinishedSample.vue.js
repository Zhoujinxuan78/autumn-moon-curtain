import Masonry from 'masonry-layout';
import { ref, onMounted } from 'vue';
import { finishSampleData } from '@/constants';
import { useRouter } from 'vue-router';
const router = useRouter();
const masonry = ref(null);
const onImgLoad = () => {
    if (masonry.value) {
        new Masonry(masonry.value, {
            itemSelector: '.masonry-item',
            gutter: 12,
            fitWidth: true,
            percentPosition: true
        });
    }
};
onMounted(() => {
    // 首次初始化
    onImgLoad();
});
function openDetail(id) {
    router.push({
        name: 'descriptions',
        query: {
            data: id
        }
    });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['masonry-item']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "masonry",
    ...{ class: "masonry mx-auto" },
});
/** @type {typeof __VLS_ctx.masonry} */ ;
// @ts-ignore
[masonry,];
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.finishSampleData))) {
    // @ts-ignore
    [finishSampleData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openDetail(item.id);
                // @ts-ignore
                [openDetail,];
            } },
        key: (index),
        ...{ class: "masonry-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ onLoad: (__VLS_ctx.onImgLoad) },
        src: (item.image),
    });
    // @ts-ignore
    [onImgLoad,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "relative flex justify-center overlay" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "relative flex w-full text-[30px]" },
    });
    (item.title);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "relative flex w-full justify-end text-[24px] text-[#949AA9]" },
    });
    (item.date);
}
/** @type {__VLS_StyleScopedClasses['masonry']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['masonry-item']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[30px]']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[24px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#949AA9]']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=FinishedSample.vue.js.map