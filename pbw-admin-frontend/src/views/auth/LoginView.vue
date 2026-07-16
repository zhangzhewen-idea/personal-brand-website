<template>
  <main class="login-page">
    <section class="login-visual" aria-label="品牌介绍">
      <div class="visual-mark">PBW</div>
      <p class="visual-kicker">PERSONAL BRAND WORKSPACE</p>
      <h1>专注内容，<br />沉淀个人品牌。</h1>
      <p class="visual-caption">用清晰的后台，管理每一次表达。</p>
    </section>
    <section class="login-panel">
      <div class="login-card">
        <div class="login-heading">
          <span class="eyebrow">ADMIN CONSOLE</span>
          <h2>欢迎回来</h2>
          <p>登录后台，继续管理你的内容。</p>
        </div>
        <el-alert title="临时测试模式" type="info" :closable="false" show-icon />
        <p class="test-account">测试账号：<strong>admin</strong> / <strong>123456</strong></p>
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" data-testid="account-input" autocomplete="username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" data-testid="password-input" type="password" show-password autocomplete="current-password" placeholder="请输入密码" />
          </el-form-item>
          <el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" show-icon class="login-error" />
          <el-button native-type="button" type="primary" :loading="authStore.loading" data-testid="login-submit" class="login-submit" @click="submit">登录后台</el-button>
        </el-form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const form = reactive({ account: 'admin', password: '123456', testMode: true })
const rules: FormRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const errorMessage = computed(() => authStore.error?.message ?? '')

const submit = async () => {
  if (!formRef.value || !(await formRef.value.validate().catch(() => false))) return
  try {
    await authStore.login(form)
    await router.push('/dashboard')
  } catch {
    // 错误已由 store 提供给页面展示。
  }
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr); background: #f7f9fc; }
.login-visual { display: flex; flex-direction: column; justify-content: center; padding: 12vw; color: #f8fbff; background: linear-gradient(145deg, #526e91, #314c6d 65%, #243d5a); }
.visual-mark { width: 52px; height: 52px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.45); font-size: 13px; letter-spacing: .12em; }
.visual-kicker, .eyebrow { margin: 26px 0 14px; font-size: 11px; letter-spacing: .18em; opacity: .7; }
.login-visual h1 { margin: 0; font-size: clamp(36px, 4vw, 64px); line-height: 1.18; letter-spacing: -.04em; font-weight: 600; }
.visual-caption { margin-top: 28px; color: #d7e3f2; }
.login-panel { display: grid; place-items: center; padding: 48px; }
.login-card { width: min(100%, 390px); }
.login-heading h2 { margin: 0 0 8px; color: #1f2f46; font-size: 32px; font-weight: 600; }
.login-heading p, .test-account { color: #8793a4; font-size: 14px; }
.login-heading p { margin: 0 0 30px; }
.test-account { margin: 14px 0 24px; }
.test-account strong { color: #526e91; font-weight: 600; }
.login-error { margin-bottom: 18px; }
.login-submit { width: 100%; height: 42px; margin-top: 8px; }
@media (max-width: 760px) { .login-page { display: block; } .login-visual { min-height: 250px; padding: 42px 30px; } .login-visual h1 { font-size: 38px; } .visual-caption { margin-top: 16px; } .login-panel { padding: 42px 26px; } }
</style>
