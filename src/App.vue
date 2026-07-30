<script setup lang="ts"></script>

<template>
  <van-config-provider :theme-vars="{ primaryColor: '#b5683f' }">
    <router-view v-slot="{ Component }">
      <transition name="drape" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </van-config-provider>
</template>
