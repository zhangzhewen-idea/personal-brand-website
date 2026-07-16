<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import ConsultingServiceCard from '@/components/sections/consulting/ConsultingServiceCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import { caseStudies, consultingServices, cooperationWorkflow } from '@/configs/consulting.config'

const isDialogOpen = ref(false)
</script>

<template>
  <main data-testid="consulting-view" class="bg-gray-50">
    <section class="bg-gray-950 px-6 py-20 text-white sm:py-28">
      <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">专业视频咨询服务</p>
          <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">商业剪辑服务</h1>
          <p class="mt-6 max-w-xl text-lg leading-8 text-gray-300">从创意策划到后期制作，为品牌和企业提供高效、专业的视频解决方案。</p>
        </div>
        <BaseButton data-testid="consulting-cta" size="lg" @click="isDialogOpen = true">立即咨询</BaseButton>
      </div>
    </section>

    <section class="px-6 py-16 sm:py-24">
      <div class="mx-auto max-w-7xl">
        <SectionHeading title="为你定制专业影像" description="覆盖企业宣传、电商营销和活动记录等常见视频需求" />
        <div data-testid="consulting-service-grid" class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <ConsultingServiceCard v-for="service in consultingServices" :key="service.id" :service="service" />
        </div>
      </div>
    </section>

    <section class="bg-white px-6 py-16 sm:py-24">
      <div class="mx-auto max-w-7xl">
        <SectionHeading title="四步开启合作" description="从需求沟通到成片交付，清晰高效地推进每一个环节" />
        <div data-testid="workflow-grid" class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="item in cooperationWorkflow" :key="item.step" data-testid="workflow-step" class="relative text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-lg font-semibold text-white">{{ item.step }}</div>
            <h3 class="mt-5 font-semibold text-gray-950">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-gray-600">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="px-6 py-16 sm:py-24">
      <div class="mx-auto max-w-7xl">
        <SectionHeading title="一起完成的作品" description="用专业剪辑把每个品牌故事呈现得更有感染力" />
        <div data-testid="case-study-grid" class="mt-12 grid gap-5 md:grid-cols-3">
          <article v-for="caseStudy in caseStudies" :key="caseStudy.id" data-testid="case-study" class="rounded-2xl border border-gray-200 bg-white p-6">
            <div class="flex h-40 items-center justify-center rounded-xl bg-gray-100 text-sm font-medium text-gray-400">客户案例 {{ caseStudy.id }}</div>
            <h3 class="mt-5 text-lg font-semibold text-gray-950">{{ caseStudy.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-gray-600">{{ caseStudy.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <BaseDialog v-model="isDialogOpen" title="立即咨询">
      <div class="space-y-4 text-gray-600">
        <p class="text-lg font-medium text-gray-950">欢迎咨询视频制作服务</p>
        <p>请扫码添加微信，说明你的项目需求，我们会尽快与你沟通。</p>
        <p class="rounded-xl bg-gray-50 p-4 text-sm">咨询时可一并提供项目类型、预计时长、交付时间和预算范围。</p>
      </div>
    </BaseDialog>
  </main>
</template>
