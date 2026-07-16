<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const nickname = ref('')
const account = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>

<template>
  <form data-testid="register-form" class="space-y-5" @submit.prevent>
    <div data-testid="register-nickname"><BaseInput id="register-nickname" v-model="nickname" name="nickname" label="昵称" placeholder="请输入昵称" autocomplete="nickname" /></div>
    <div data-testid="register-account"><BaseInput id="register-account" v-model="account" name="account" label="账号" placeholder="请输入账号" autocomplete="username" /></div>
    <div data-testid="register-email"><BaseInput id="register-email" v-model="email" name="email" label="邮箱" type="email" placeholder="请输入邮箱" autocomplete="email" /></div>
    <div data-testid="register-password">
      <BaseInput id="register-password" v-model="password" name="password" label="密码" placeholder="请设置密码" :type="showPassword ? 'text' : 'password'" autocomplete="new-password">
        <template #trailing>
          <button data-testid="register-password-toggle" type="button" class="text-sm text-gray-500 hover:text-gray-950" :aria-label="showPassword ? '隐藏密码' : '显示密码'" @click="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </template>
      </BaseInput>
    </div>
    <div data-testid="register-confirm-password">
      <BaseInput id="register-confirm-password" v-model="confirmPassword" name="confirmPassword" label="确认密码" placeholder="请再次输入密码" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password">
        <template #trailing>
          <button data-testid="register-confirm-password-toggle" type="button" class="text-sm text-gray-500 hover:text-gray-950" :aria-label="showConfirmPassword ? '隐藏密码' : '显示密码'" @click="showConfirmPassword = !showConfirmPassword">
            {{ showConfirmPassword ? '隐藏' : '显示' }}
          </button>
        </template>
      </BaseInput>
    </div>
    <BaseButton data-testid="register-submit" class="w-full" type="submit" size="lg">注册</BaseButton>
  </form>
</template>
