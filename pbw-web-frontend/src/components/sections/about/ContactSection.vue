<script setup lang="ts">
import type { BasicInfo } from '@/models'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ basicInfo: BasicInfo | null }>()
</script>

<template>
  <section class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-24 text-white lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <SectionHeading title="联系方式" description="期待与您的合作" />
    <div class="grid gap-10 lg:grid-cols-2">
      <div class="rounded-2xl bg-white/10 p-8 backdrop-blur-md">
        <h3 class="text-xl font-semibold">商务合作邮箱</h3>
        <a v-if="basicInfo?.contactEmail" data-testid="contact-email" :href="`mailto:${basicInfo.contactEmail}`" class="mt-3 inline-flex items-center font-semibold text-blue-100 underline underline-offset-4">{{ basicInfo.contactEmail }}</a>
        <p class="mt-4 text-sm text-blue-100">{{ basicInfo?.contactInfo || '欢迎来信交流。' }}</p>
      </div>
      <div class="rounded-2xl bg-white/10 p-8 backdrop-blur-md">
        <h3 class="text-xl font-semibold">合作微信</h3>
        <p class="mt-3 text-sm text-blue-100">扫码添加（注明“商务合作”）</p>
        <img v-if="basicInfo?.contactQrCode" data-testid="contact-qr-code" :src="basicInfo.contactQrCode" alt="合作微信二维码" class="mx-auto mt-5 h-32 w-32 rounded-lg bg-white object-contain p-2" />
      </div>
    </div>
    </div>
  </section>
</template>
