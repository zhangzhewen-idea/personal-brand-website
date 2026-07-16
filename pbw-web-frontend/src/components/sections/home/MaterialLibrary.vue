<script setup lang="ts">
import { ref } from 'vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import type { MaterialCardViewModel } from '@/models'
import { formatPrice } from '@/shared/formatters'

defineProps<{ materials: MaterialCardViewModel[] }>()
const selectedMaterial = ref<MaterialCardViewModel | null>(null)
const isDialogOpen = ref(false)

function openMaterial(material: MaterialCardViewModel) {
  selectedMaterial.value = material
  isDialogOpen.value = true
}
</script>

<template>
  <section data-testid="material-library" class="bg-slate-50 px-6 py-24 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <SectionHeading title="素材库" description="为每一次创作准备好灵感与工具。" />
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="material in materials" :key="material.id" data-testid="material-card" class="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <ResponsiveImage :src="material.materialPhoto" :alt="material.materialTitle" fallback-text="素材预览" class="h-40 w-full object-cover" />
          <div class="p-5"><h3 class="font-semibold">{{ material.materialTitle }}</h3><p class="mt-2 min-h-12 text-sm text-gray-600">{{ material.materialIntro }}</p><div class="mt-4 flex items-center justify-between text-sm"><span class="text-gray-500">{{ material.itemCount }} 项 · {{ formatPrice(material.price) }}</span><BaseButton variant="ghost" size="sm" @click="openMaterial(material)">查看详情</BaseButton></div></div>
        </article>
      </div>
    </div>
    <BaseDialog v-if="selectedMaterial" v-model="isDialogOpen" :title="selectedMaterial.materialTitle">
      <p class="leading-7 text-gray-600">{{ selectedMaterial.materialIntro }}</p>
      <p class="mt-4 text-sm text-gray-500">包含 {{ selectedMaterial.itemCount }} 项素材，当前价格：{{ formatPrice(selectedMaterial.price) }}。</p>
    </BaseDialog>
  </section>
</template>
