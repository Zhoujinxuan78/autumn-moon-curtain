<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { signIn, loading, error } = useAuth()

const email = ref('')
const password = ref('')

async function onSubmit() {
  const ok = await signIn(email.value, password.value)
  if (ok) {
    showSuccessToast('登录成功')
    router.replace((route.query.redirect as string) || '/admin/dashboard')
    return
  }
  if (!ok && error.value) showFailToast(error.value)
}
</script>

<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-6">
    <div class="w-full max-w-sm">
      <h1 class="text-xl font-semibold text-center brand-text mb-1">
        帘语 · 管理后台
      </h1>
      <p class="text-center text-xs text-gray-400 mb-6">
        管理员登录
      </p>

      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="email"
            name="email"
            label="邮箱"
            placeholder="you@example.com"
            type="email"
            :rules="[{ required: true, message: '请填写邮箱' }]"
          />
          <van-field
            v-model="password"
            name="password"
            label="密码"
            type="password"
            placeholder="至少 6 位"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>

        <div class="px-4 mt-4">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
