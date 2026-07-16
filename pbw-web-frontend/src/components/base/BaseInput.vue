<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    id: string
    modelValue: string
    label: string
    type?: 'text' | 'email' | 'password'
    placeholder?: string
    autocomplete?: string
  }>(),
  { type: 'text', placeholder: '', autocomplete: '' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const inputType = computed(() => props.type)
</script>

<template>
  <div class="space-y-2">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative">
      <span v-if="$slots.leading" data-testid="input-leading" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><slot name="leading" /></span>
      <input
        v-bind="attrs"
        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-gray-950"
        :class="{ 'pl-10': $slots.leading, 'pr-10': $slots.trailing }"
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <span v-if="$slots.trailing" data-testid="input-trailing" class="absolute inset-y-0 right-0 flex items-center pr-3"><slot name="trailing" /></span>
    </div>
  </div>
</template>
