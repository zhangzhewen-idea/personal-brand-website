<script lang="ts">
let nextDialogId = 0
type DialogInstance = { close: () => void }
const openDialogInstances: DialogInstance[] = []
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'

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
const titleId = `base-dialog-title-${++nextDialogId}`
const closeButton = ref<HTMLButtonElement | null>(null)
let restoreTarget: HTMLElement | null = null
let registered = false
const instance: DialogInstance = { close }

function close() {
  unregister()
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue && openDialogInstances.at(-1) === instance) close()
}

function register() {
  if (registered) return
  restoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null
  openDialogInstances.push(instance)
  registered = true
  document.addEventListener('keydown', onKeydown)
  void nextTick(() => closeButton.value?.focus())
}

function unregister() {
  if (!registered) return
  const index = openDialogInstances.indexOf(instance)
  if (index >= 0) openDialogInstances.splice(index, 1)
  registered = false
  document.removeEventListener('keydown', onKeydown)
  if (restoreTarget) void nextTick(() => restoreTarget?.focus())
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) register()
  else unregister()
}, { immediate: true })

onBeforeUnmount(unregister)
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" v-bind="attrs" data-testid="base-dialog" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" :aria-labelledby="titleId" :title="title">
      <button type="button" class="absolute inset-0 bg-black/60" aria-label="关闭弹窗" @click="close" />
      <section class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <header class="relative z-10 mb-4 flex items-center justify-between">
          <template v-if="$slots.header">
            <h2 :id="titleId" class="sr-only">{{ title }}</h2>
            <slot name="header" />
          </template>
          <slot v-else name="header"><h2 :id="titleId">{{ title }}</h2></slot>
          <button ref="closeButton" data-testid="dialog-close" type="button" aria-label="关闭" @click="close">×</button>
        </header>
        <div><slot /></div>
      </section>
    </div>
  </Teleport>
</template>
