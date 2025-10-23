<template>
    <div class="layout">
        <!-- 这里可以放通用结构，例如导航栏、背景、头图等 -->
        <router-view />
    </div>
</template>

<script setup lang="ts">
// 空的也没问题，这只是容器层
</script>

<style scoped>
.layout {
    width: 100%;
    height: 100%;
}
</style>