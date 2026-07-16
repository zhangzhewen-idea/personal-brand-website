<script setup lang="ts">
import { onBeforeUnmount, onMounted, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const attrs = useAttrs()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" v-bind="attrs" data-testid="base-dialog" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title" :title="title">
      <button type="button" class="absolute inset-0 bg-black/60" aria-label="关闭弹窗" @click="close" />
      <section class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <header class="relative z-10 mb-4 flex items-center justify-between">
          <template v-if="$slots.header">
            <h2 id="dialog-title" class="sr-only">{{ title }}</h2>
            <slot name="header" />
          </template>
          <slot v-else name="header"><h2 id="dialog-title">{{ title }}</h2></slot>
          <button data-testid="dialog-close" type="button" aria-label="关闭" @click="close">×</button>
        </header>
        <div><slot /></div>
      </section>
    </div>
  </Teleport>
</template>
