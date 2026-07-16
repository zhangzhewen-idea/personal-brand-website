<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const account = ref('')
const password = ref('')
const showPassword = ref(false)
</script>

<template>
  <form data-testid="login-form" class="space-y-5" @submit.prevent>
    <div data-testid="login-account"><BaseInput id="login-account" v-model="account" name="account" label="账号" placeholder="请输入账号" autocomplete="username" /></div>
    <div data-testid="login-password">
      <BaseInput id="login-password" v-model="password" name="password" label="密码" placeholder="请输入密码" :type="showPassword ? 'text' : 'password'" autocomplete="current-password">
        <template #trailing>
          <button data-testid="login-password-toggle" type="button" class="text-sm text-gray-500 hover:text-gray-950" :aria-label="showPassword ? '隐藏密码' : '显示密码'" @click="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </template>
      </BaseInput>
    </div>
    <div class="flex items-center justify-between text-sm">
      <label class="flex items-center gap-2 text-gray-600"><input type="checkbox" class="h-4 w-4 rounded border-gray-300"> 记住我</label>
      <a href="#" class="font-medium text-gray-700 hover:text-gray-950">忘记密码？</a>
    </div>
    <BaseButton data-testid="login-submit" class="w-full" type="submit" size="lg">登录</BaseButton>
  </form>
</template>
