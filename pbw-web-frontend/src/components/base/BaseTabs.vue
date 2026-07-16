<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
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
        :class="modelValue === tab.value ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-700'"
        @click="emit('update:modelValue', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <slot :active="modelValue" />
  </div>
</template>
