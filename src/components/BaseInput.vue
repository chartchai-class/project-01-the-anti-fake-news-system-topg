<script setup lang="ts">
const modelValue = defineModel()

interface BaseInputProps {
  label?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  label: '',
})
</script>

<template>
  <div class="flex flex-col w-full">
    <label v-if="props.label" class="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
      {{ props.label }}
    </label>
    <input
      v-bind="$attrs"
      v-model="modelValue"
      :placeholder="props.label"
      class="w-full bg-[#2a2a2e] text-gray-100 border border-[#1c1c1f] rounded-xl px-4 py-3 placeholder-gray-500 hover:bg-[#323236] hover:border-[#29292c] transition-all duration-200 focus:outline-none"
    />
  </div>
</template>
