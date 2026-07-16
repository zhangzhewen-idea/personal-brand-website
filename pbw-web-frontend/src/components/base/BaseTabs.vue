<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  tabs: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onKeydown(event: KeyboardEvent, index: number) {
  let nextIndex = index
  if (event.key === 'ArrowLeft') nextIndex = (index - 1 + props.tabs.length) % props.tabs.length
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % props.tabs.length
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = props.tabs.length - 1
  if (nextIndex === index) return

  event.preventDefault()
  emit('update:modelValue', props.tabs[nextIndex].value)
  const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  buttons?.[nextIndex]?.focus()
}
</script>

<template>
  <div>
    <div
      class="grid rounded-lg bg-gray-200/70 p-1"
      :style="{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }"
      role="tablist"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :data-testid="`tab-${tab.value}`"
        :data-tab="tab.value"
        type="button"
        role="tab"
        :aria-selected="modelValue === tab.value"
        :tabindex="modelValue === tab.value ? 0 : -1"
        :class="modelValue === tab.value ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-700'"
        @click="emit('update:modelValue', tab.value)"
        @keydown="onKeydown($event, tabs.indexOf(tab))"
      >
        {{ tab.label }}
      </button>
    </div>
    <slot :active="modelValue" />
  </div>
</template>
