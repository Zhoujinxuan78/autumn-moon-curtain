import { ref, onMounted } from 'vue';
const props = defineProps({
    finishedItem: {
        type: Object,
    }
});
const emits = defineEmits(["on-item-click"]);
function onItemClick() {
    emits("on-item-click", props.finishedItem.descImage);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative flex justify-center items-center h-[168px] w-[168px] bg-[#FFFFFF] rounded-[50px] shadow-[0_6px_30px_0_rgba(0,0,0,0.2)] " },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ onClick: (__VLS_ctx.onItemClick) },
    src: (__VLS_ctx.finishedItem.descImage),
    ...{ class: "w-[120px] h-[120px]" },
});
// @ts-ignore
[onItemClick, finishedItem,];
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[168px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[168px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#FFFFFF]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-[50px]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_6px_30px_0_rgba(0,0,0,0.2)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[120px]']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => ({
        ...props,
        ...{},
        ...{},
    }),
});
export default {};
//# sourceMappingURL=finishedItem.vue.js.map