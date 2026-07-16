<script setup lang="ts">
const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
} as const

const variantClasses = {
  primary: 'bg-[#030213] text-white',
  secondary: 'bg-gray-100 text-gray-900',
  outline: 'border border-gray-300 bg-transparent text-gray-950',
  ghost: 'bg-transparent text-gray-700',
} as const

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', disabled: false, type: 'button' },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['inline-flex items-center justify-center rounded-lg font-medium transition-colors', variantClasses[variant], sizeClasses[size]]"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
