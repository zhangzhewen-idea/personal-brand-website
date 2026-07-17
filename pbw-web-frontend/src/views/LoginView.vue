<script setup lang="ts">
import { Eye, EyeOff, Lock, Mail, User, Video } from 'lucide-vue-next'
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { getApiErrorMessage } from '@/api/http'
import { userApi } from '@/api/user'
import { useSiteStore } from '@/stores/site'

type Mode = 'login' | 'register' | 'forgot' | 'reset'

const route = useRoute()
const router = useRouter()
const store = useSiteStore()
const { basicInfo } = storeToRefs(store)
const mode = ref<Mode>('login')
const showPassword = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const remember = ref(false)
const acceptedTerms = ref(false)
const loginForm = reactive({ account: '', password: '' })
const registerForm = reactive({ nickname: '', account: '', email: '', password: '', confirmPassword: '' })
const accountOrEmail = ref('')
const resetForm = reactive({ resetToken: '', newPassword: '', confirmPassword: '' })
const formatCount = (count: number) => count >= 10_000 ? `${Math.floor(count / 10_000)}万+` : `${count}`
const pageTitle = computed(() => ({ login: '欢迎回来', register: '创建账号', forgot: '找回密码', reset: '设置新密码' })[mode.value])
const pageIntro = computed(() => ({ login: '登录你的账号继续创作', register: '加入我们，开启创作之旅', forgot: '输入邮箱以接收重置邮件', reset: '请输入符合要求的新密码' })[mode.value])

const requiredFieldNames: Record<string, string> = {
  nickname: '请输入昵称',
  account: '请输入账号',
  email: '请输入邮箱',
  password: '请输入密码',
  confirmPassword: '请再次输入密码',
  accountOrEmail: '请输入邮箱',
  newPassword: '请输入新密码',
  resetConfirmPassword: '请再次输入新密码',
}

const handleInvalid = (event: Event) => {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return

  let message = '请检查此字段的输入'
  if (input.validity.valueMissing) message = requiredFieldNames[input.name] || message
  else if (input.name === 'account' && mode.value === 'register' && (input.validity.tooShort || input.validity.patternMismatch)) message = '账号须为 3-32 位，只能包含英文字母、数字和下划线，且必须以字母或数字开头'
  else if ((input.name === 'email' || input.name === 'accountOrEmail') && input.validity.typeMismatch) message = '请输入有效邮箱地址，例如 name@example.com'
  else if ((input.name === 'password' && mode.value === 'register') || input.name === 'newPassword') message = '密码须为 8-72 位，且至少包含一个字母和一个数字'
  else if (input.validity.tooShort) message = `输入内容至少需要 ${input.minLength} 个字符`
  else if (input.validity.tooLong) message = `输入内容不能超过 ${input.maxLength} 个字符`

  input.setCustomValidity(message)
}

const clearFieldValidity = (event: Event) => {
  const input = event.target
  if (input instanceof HTMLInputElement) input.setCustomValidity('')
}

const switchMode = (next: Mode) => { mode.value = next; errorMessage.value = ''; successMessage.value = '' }
const submit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  if (mode.value === 'register' && registerForm.password !== registerForm.confirmPassword) { errorMessage.value = '两次输入的密码不一致'; return }
  if (mode.value === 'register' && !acceptedTerms.value) { errorMessage.value = '请先同意服务条款和隐私政策'; return }
  if (mode.value === 'reset' && resetForm.newPassword !== resetForm.confirmPassword) { errorMessage.value = '两次输入的密码不一致'; return }
  submitting.value = true
  try {
    if (mode.value === 'login') {
      await store.login(loginForm, remember.value)
      await router.push('/')
    } else if (mode.value === 'register') {
      await store.register({ nickname: registerForm.nickname, account: registerForm.account, email: registerForm.email, password: registerForm.password })
      await router.push('/')
    } else if (mode.value === 'forgot') {
      const result = await userApi.requestPasswordReset({ accountOrEmail: accountOrEmail.value })
      successMessage.value = result.message
    } else {
      await userApi.resetPassword({ resetToken: resetForm.resetToken, newPassword: resetForm.newPassword })
      successMessage.value = '密码已重置，请使用新密码登录'
      loginForm.password = ''
      mode.value = 'login'
    }
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, '操作失败，请检查输入后重试')
  } finally { submitting.value = false }
}

onMounted(() => {
  store.loadBasicInfo().catch(() => undefined)
  const token = typeof route.query.resetToken === 'string' ? route.query.resetToken : ''
  if (token) { resetForm.resetToken = token; mode.value = 'reset' }
})
</script>

<template>
  <div class="flex min-h-screen">
    <section class="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-white lg:flex">
      <RouterLink to="/" class="flex items-center gap-2"><Video class="h-8 w-8" /><span class="text-2xl font-bold">影像创作者</span></RouterLink>
      <div class="space-y-6"><h1 class="text-5xl font-bold leading-tight">用剪辑重构<br />影像记忆</h1><p class="text-xl text-blue-100">加入我们，开启你的创作之旅</p><div class="grid grid-cols-3 gap-6 pt-8"><div><div class="text-3xl font-bold">{{ formatCount(basicInfo?.totalPlayCount ?? 0) }}</div><div class="text-sm text-blue-200">全网播放</div></div><div><div class="text-3xl font-bold">{{ formatCount(basicInfo?.totalLikeCount ?? 0) }}</div><div class="text-sm text-blue-200">点赞收藏</div></div><div><div class="text-3xl font-bold">{{ formatCount(basicInfo?.totalFollowerCount ?? 0) }}</div><div class="text-sm text-blue-200">忠实粉丝</div></div></div></div>
      <div class="text-sm text-blue-200">© 2026 影像创作者. All rights reserved.</div>
    </section>
    <section class="flex flex-1 items-center justify-center bg-gray-50 p-8"><div class="w-full max-w-md"><div class="mb-8 flex items-center justify-center gap-2 lg:hidden"><Video class="h-8 w-8 text-blue-600" /><span class="text-2xl font-bold">影像创作者</span></div>
      <div v-if="mode === 'login' || mode === 'register'" class="mb-8 grid grid-cols-2 rounded-lg bg-gray-200 p-1"><button class="rounded-md py-2 text-sm font-medium" :class="mode === 'login' ? 'bg-white shadow-sm' : 'text-gray-600'" @click="switchMode('login')">登录</button><button class="rounded-md py-2 text-sm font-medium" :class="mode === 'register' ? 'bg-white shadow-sm' : 'text-gray-600'" @click="switchMode('register')">注册</button></div>
      <div class="rounded-2xl bg-white p-8 shadow-xl"><div class="mb-6"><h2 class="mb-2 text-2xl font-bold">{{ pageTitle }}</h2><p class="text-gray-600">{{ pageIntro }}</p></div>
        <form class="space-y-4" @submit.prevent="submit" @invalid.capture="handleInvalid" @input.capture="clearFieldValidity">
          <template v-if="mode === 'login' || mode === 'register'">
            <label v-if="mode === 'register'" class="block"><span class="font-medium">昵称</span><span class="relative mt-1 block"><User class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-model.trim="registerForm.nickname" name="nickname" required maxlength="50" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="你的昵称" /></span></label>
            <label class="block"><span class="font-medium">账号</span><span class="relative mt-1 block"><User class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-if="mode === 'login'" v-model.trim="loginForm.account" name="account" required maxlength="255" autocomplete="username" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入账号" /><input v-else v-model.trim="registerForm.account" name="account" required minlength="3" maxlength="32" pattern="[A-Za-z0-9][A-Za-z0-9_]{2,31}" autocomplete="username" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入账号" /></span></label>
            <label v-if="mode === 'register'" class="block"><span class="font-medium">邮箱</span><span class="relative mt-1 block"><Mail class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-model.trim="registerForm.email" name="email" type="email" required maxlength="255" autocomplete="email" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" /></span></label>
            <label class="block"><span class="font-medium">密码</span><span class="relative mt-1 block"><Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-if="mode === 'login'" v-model="loginForm.password" name="password" :type="showPassword ? 'text' : 'password'" required minlength="6" maxlength="72" autocomplete="current-password" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" /><input v-else v-model="registerForm.password" name="password" :type="showPassword ? 'text' : 'password'" required minlength="8" maxlength="72" pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,72}" autocomplete="new-password" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500" placeholder="至少 8 位，包含字母和数字" /><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="显示密码" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" class="h-5 w-5" /><Eye v-else class="h-5 w-5" /></button></span></label>
            <label v-if="mode === 'register'" class="block"><span class="font-medium">确认密码</span><span class="relative mt-1 block"><Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-model="registerForm.confirmPassword" name="confirmPassword" type="password" required minlength="8" maxlength="72" autocomplete="new-password" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="再次输入密码" /></span></label>
            <div v-if="mode === 'login'" class="flex items-center justify-between text-sm"><label class="flex items-center gap-2 text-gray-600"><input v-model="remember" type="checkbox" />记住我</label><button type="button" class="text-blue-600" @click="switchMode('forgot')">忘记密码?</button></div>
            <label v-else class="flex items-start gap-2 text-sm text-gray-600"><input v-model="acceptedTerms" type="checkbox" class="mt-1" />我同意服务条款和隐私政策</label>
          </template>
          <label v-else-if="mode === 'forgot'" class="block"><span class="font-medium">邮箱</span><span class="relative mt-1 block"><Mail class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-model.trim="accountOrEmail" name="accountOrEmail" type="email" required maxlength="255" autocomplete="email" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入邮箱" /></span></label>
          <template v-else>
            <label class="block"><span class="font-medium">新密码</span><span class="relative mt-1 block"><Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-model="resetForm.newPassword" name="newPassword" type="password" required minlength="8" maxlength="72" pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,72}" autocomplete="new-password" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="至少 8 位，包含字母和数字" /></span></label>
            <label class="block"><span class="font-medium">确认新密码</span><span class="relative mt-1 block"><Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input v-model="resetForm.confirmPassword" name="resetConfirmPassword" type="password" required minlength="8" maxlength="72" autocomplete="new-password" class="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="再次输入新密码" /></span></label>
          </template>
          <p v-if="errorMessage" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>
          <p v-if="successMessage" class="rounded-md bg-green-50 p-3 text-sm text-green-700">{{ successMessage }}</p>
          <button type="submit" :disabled="submitting" class="w-full rounded-md bg-gray-900 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">{{ submitting ? '正在提交…' : ({ login: '登录', register: '注册', forgot: '发送重置邮件', reset: '重置密码' }[mode]) }}</button>
        </form>
        <div v-if="mode === 'login' || mode === 'register'" class="mt-6 text-center text-sm text-gray-600">{{ mode === 'login' ? '还没有账号?' : '已有账号?' }} <button class="font-medium text-blue-600" @click="switchMode(mode === 'login' ? 'register' : 'login')">{{ mode === 'login' ? '立即注册' : '立即登录' }}</button></div>
        <div v-else class="mt-6 text-center"><button class="text-sm font-medium text-blue-600" @click="switchMode('login')">返回登录</button></div>
      </div>
      <div class="mt-8 text-center"><RouterLink to="/" class="text-sm text-gray-600">← 返回首页</RouterLink></div>
    </div></section>
  </div>
</template>
