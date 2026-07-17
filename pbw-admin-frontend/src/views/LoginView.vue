<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ArrowRight, Check, Collection, Lock, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { getApiErrorMessage } from '@/api/client'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  account: 'admin',
  password: '123456',
  remember: true,
})

const rules: FormRules = {
  account: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await authStore.login(form.account, form.password)
    ElMessage.success('登录成功，欢迎回来')
    await router.replace(String(route.query.redirect || '/'))
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '登录失败，请稍后重试'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-story">
      <div class="story-grid"></div>
      <div class="story-glow story-glow--one"></div>
      <div class="story-glow story-glow--two"></div>

      <div class="story-brand">
        <span class="story-brand__mark"><Collection /></span>
        <span>
          <strong>PBW STUDIO</strong>
          <small>CONTENT OPERATING SYSTEM</small>
        </span>
      </div>

      <div class="story-content">
        <span class="story-kicker">PERSONAL BRAND WORKSPACE</span>
        <h1>让每一份内容资产，<br />都有清晰的去向。</h1>
        <p>从作品、素材到课程与账号矩阵，在一个清爽的工作空间里保持内容有序。</p>
        <div class="story-features">
          <div><el-icon><Check /></el-icon><span>内容资产集中管理</span></div>
          <div><el-icon><Check /></el-icon><span>多平台矩阵清晰可见</span></div>
          <div><el-icon><Check /></el-icon><span>为后续业务开发预留完整结构</span></div>
        </div>
      </div>

    </section>

    <section class="login-panel">
      <div class="login-card">
        <div class="login-card__heading">
          <span>PBW ADMIN</span>
          <h2>欢迎回来</h2>
          <p>登录内容管理后台，继续今天的创作管理。</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleSubmit">
          <el-form-item label="管理员账号" prop="account">
            <el-input v-model="form.account" :prefix-icon="User" size="large" placeholder="请输入管理员账号" />
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input
              v-model="form.password"
              :prefix-icon="Lock"
              size="large"
              type="password"
              show-password
              placeholder="请输入登录密码"
              @keyup.enter="handleSubmit"
            />
          </el-form-item>

          <div class="login-options">
            <el-checkbox v-model="form.remember">记住登录状态</el-checkbox>
            <button type="button">忘记密码？</button>
          </div>

          <el-button class="login-button" type="primary" size="large" :loading="loading" @click="handleSubmit">
            <span>进入管理后台</span>
            <el-icon v-if="!loading"><ArrowRight /></el-icon>
          </el-button>
        </el-form>

        <p class="login-footer">PBW Studio · 内容管理系统</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(480px, 1.08fr) minmax(520px, 0.92fr);
  background:
    radial-gradient(circle at 11% 18%, rgba(37, 99, 235, 0.32), transparent 31%),
    radial-gradient(circle at 86% 12%, rgba(124, 58, 237, 0.3), transparent 29%),
    radial-gradient(circle at 58% 88%, rgba(67, 56, 202, 0.27), transparent 36%),
    #0f0c29;
}

.login-story {
  position: relative;
  display: flex;
  overflow: hidden;
  min-height: 100vh;
  flex-direction: column;
  box-sizing: border-box;
  padding: 42px 7vw 48px;
  background: rgba(9, 8, 29, 0.32);
  color: white;
}

.story-grid {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(to bottom right, black, transparent 80%);
}

.story-glow {
  display: none;
}

.story-glow--one {
  top: 18%;
  right: -14%;
  width: 430px;
  height: 430px;
  background: radial-gradient(circle, rgba(49, 99, 255, 0.27), transparent 67%);
}

.story-glow--two {
  bottom: -20%;
  left: 12%;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(28, 198, 169, 0.11), transparent 70%);
}

.story-brand,
.story-content {
  position: relative;
  z-index: 2;
}

.story-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.story-brand__mark {
  display: grid;
  width: 39px;
  height: 39px;
  place-items: center;
  border-radius: 11px;
  background: #346fff;
  box-shadow: 0 9px 32px rgba(52, 111, 255, 0.3);
}

.story-brand__mark :deep(svg) {
  width: 19px;
}

.story-brand > span:last-child {
  display: flex;
  flex-direction: column;
}

.story-brand strong {
  font-size: 13px;
  letter-spacing: 0.06em;
}

.story-brand small {
  margin-top: 3px;
  color: #64748b;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.story-content {
  max-width: 580px;
  margin: auto 0;
  padding: 72px 0;
}

.story-kicker {
  color: #6795ff;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.2em;
}

.story-content h1 {
  margin: 22px 0 22px;
  font-size: clamp(37px, 4vw, 58px);
  font-weight: 670;
  line-height: 1.24;
  letter-spacing: -0.045em;
}

.story-content > p {
  max-width: 500px;
  margin: 0;
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.85;
}

.story-features {
  display: grid;
  gap: 13px;
  margin-top: 34px;
}

.story-features div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1;
  font-size: 13px;
}

.story-features .el-icon {
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border-radius: 50%;
  background: rgba(52, 111, 255, 0.18);
  color: #79a4ff;
  font-size: 11px;
}

.login-panel {
  display: grid;
  min-height: 100vh;
  place-items: center;
  box-sizing: border-box;
  padding: 48px 8vw;
  border-left: 1px solid rgba(174, 165, 210, 0.12);
  background: rgba(15, 12, 41, 0.34);
  backdrop-filter: blur(18px);
}

.login-card {
  width: min(100%, 410px);
}

.login-card__heading > span {
  color: var(--pbw-blue);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.18em;
}

.login-card__heading h2 {
  margin: 11px 0 7px;
  color: #f8f7ff;
  font-size: 31px;
  font-weight: 720;
  letter-spacing: -0.035em;
}

.login-card__heading p {
  margin: 0;
  color: #aaa6c4;
  font-size: 13px;
}

.login-card :deep(.el-form) {
  margin-top: 30px;
}

.login-card :deep(.el-form-item) {
  margin-bottom: 21px;
}

.login-card :deep(.el-form-item__label) {
  padding-bottom: 7px;
  color: #d1cee2;
  font-size: 12px;
  font-weight: 650;
}

.login-card :deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #dce3ed inset;
}

.login-card :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--pbw-blue) inset, 0 0 0 3px rgba(52, 111, 255, 0.08);
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -3px 0 20px;
}

.login-options button {
  border: 0;
  background: none;
  color: var(--pbw-blue);
  cursor: pointer;
  font-size: 12px;
}

.login-button {
  width: 100%;
  height: 47px;
  border-radius: 10px;
  box-shadow: 0 9px 22px rgba(52, 111, 255, 0.2);
  font-weight: 650;
}

.login-button span {
  margin-right: 8px;
}

.test-account {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
  color: #9d98b5;
  font-size: 11px;
}

.test-account code {
  padding: 3px 7px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: white;
  color: #475569;
  font-family: inherit;
}

.test-account i {
  color: #cbd5e1;
  font-style: normal;
}

.login-footer {
  margin: 42px 0 0;
  color: #716c8c;
  font-size: 10px;
  text-align: center;
}

@media (max-width: 980px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-story {
    display: none;
  }

  .login-panel {
    padding: 40px 24px;
  }
}
</style>
