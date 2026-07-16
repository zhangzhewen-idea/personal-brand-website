<script setup lang="ts">
import type { BasicInfo } from '@/models'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ basicInfo: BasicInfo | null }>()
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
    <SectionHeading title="灵感片单与合作联系" description="记录影响创作的电影，也欢迎通过邮箱聊聊合作。" />
    <div class="grid gap-10 lg:grid-cols-2">
      <div class="rounded-3xl border border-gray-200 p-8">
        <h3 class="text-xl font-semibold">年度十佳</h3>
        <ol class="mt-5 space-y-3 text-gray-600">
          <li v-for="(film, index) in basicInfo?.annualTop10Films || []" :key="film"><span class="mr-3 text-sm font-semibold text-amber-500">{{ String(index + 1).padStart(2, '0') }}</span>{{ film }}</li>
        </ol>
      </div>
      <div class="rounded-3xl border border-gray-200 p-8">
        <h3 class="text-xl font-semibold">三位导演</h3>
        <ul class="mt-5 space-y-3 text-gray-600"><li v-for="director in basicInfo?.influentialThreeDirectors || []" :key="director">{{ director }}</li></ul>
        <div class="mt-8 border-t border-gray-100 pt-6">
          <a v-if="basicInfo?.contactEmail" data-testid="contact-email" :href="`mailto:${basicInfo.contactEmail}`" class="font-semibold text-gray-950 underline decoration-amber-400 decoration-2 underline-offset-4">{{ basicInfo.contactEmail }}</a>
          <p class="mt-3 text-sm text-gray-600">{{ basicInfo?.contactInfo || '欢迎来信交流。' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
