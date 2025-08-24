<script setup lang="ts">
import { type News } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  news: News
}>()

// ✅ Compute status from votes
const status = computed(() => {
  if (props.news.trueVotes > props.news.falseVotes) return 'True'
  if (props.news.falseVotes > props.news.trueVotes) return 'False'
  return 'Pending'
})
</script>

<template>
  <RouterLink
    class="no-underline text-white"
    :to="{ name: 'news-detail-view', params: { id: news.id } }"
  >
    <div
      class="cursor-pointer p-5 w-[410px] h-[250px] rounded-2xl hover:scale-[1.01] hover:shadow-sp transition-transform duration-200 flex flex-col"
      :class="{
        'bg-gradient-to-r from-[rgb(28,28,30)] to-green-300': status === 'True',
        'bg-gradient-to-r from-[rgb(28,28,30)] to-red-400': status === 'False',
        'bg-gradient-to-r from-[rgb(28,28,30)] to-yellow-300': status === 'Pending',
        'bg-white': !['True', 'False', 'Pending'].includes(status as string),
      }"
    >
      <!-- Title -->
      <div class="flex-none mb-2">
        <h2 class="text-lg font-bold break-words min-h-[40px]">
          {{ news.topic }}
        </h2>
      </div>

      <!-- Description -->
      <div class="flex-none mb-2 overflow-auto min-h-[80px]">
        <p class="text-sm text-white/80 break-words">
          {{ news.short_detail }}
        </p>
      </div>

      <!-- Status -->
      <div class="flex-none mb-2">
        <span
          class="inline-block px-3 py-1 rounded-md font-semibold text-xs cursor-default select-none bg-white bg-opacity-80 text-gray-900 shadow-sm"
        >
          Status: {{ status }}
        </span>
      </div>

      <!-- Reporter -->
      <div class="flex-none text-xs text-white/70 mb-1 min-h-[20px]">by {{ news.reporter }}</div>

      <!-- Date/time -->
      <div class="flex-none text-xs text-white/60 min-h-[20px]">
        on {{ news.date }} @ {{ news.time }}
      </div>
    </div>
  </RouterLink>
</template>
