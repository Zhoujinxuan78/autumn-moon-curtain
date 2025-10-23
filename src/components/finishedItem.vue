<template>
    <div
        class="relative flex justify-center items-center h-[168px] w-[168px] bg-[#FFFFFF] rounded-[50px] shadow-[0_6px_30px_0_rgba(0,0,0,0.2)] ">
        <img :src="finishedItem.descImage" class="w-[120px] h-[120px]" @click="onItemClick" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    finishedItem: {
        type: Object,
    }
})

const emits = defineEmits(["on-item-click"]);
function onItemClick() {
    emits("on-item-click", props.finishedItem.descImage);
}
</script>

<style scoped></style>