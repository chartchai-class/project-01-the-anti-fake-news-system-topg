<script setup lang="ts">
import { type News } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  news: News
}>()

// Compute status from votes
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
      class="cursor-pointer p-5 w-[410px] h-[250px] rounded-2xl hover:scale-[1.03] hover:shadow-sp transition-transform duration-200 flex flex-col justify-between"
      :class="{
        'bg-gradient-to-r from-[rgb(28,28,30)] to-emerald-500': status === 'True',
        'bg-gradient-to-r from-[rgb(28,28,30)] to-rose-500': status === 'False',
        'bg-gradient-to-r from-[rgb(28,28,30)] to-amber-400': status === 'Pending',
        'bg-white': !['True', 'False', 'Pending'].includes(status as string),
      }"
    >
      <!-- Title -->
      <div class="flex-none mb-2">
        <h2 class="text-xl font-bold break-words min-h-[40px]">
          {{ news.topic }}
        </h2>
      </div>

      <!-- Description -->
      <div class="flex-none mb-2 overflow-auto min-h-[80px] text-left">
        <p class="text-base text-white/90 break-words">
          {{ news.short_detail }}
        </p>
      </div>

      <!-- Status -->
      <div class="flex-none mb-2">
        <span
          class="inline-block px-5 py-2 rounded-full font-semibold text-sm text-white/80 bg-white/20 backdrop-blur-sm shadow-sm"
        >
          Status: {{ status }}
        </span>
      </div>

      <!-- Reporter and Date/Time -->
      <div class="flex justify-between items-center mt-auto">
        <div class="text-lg font-semibold text-white">
          {{ news.reporter }}
        </div>
        <div class="text-sm text-white/70">{{ news.date }} @ {{ news.time }}</div>
      </div>
    </div>
  </RouterLink>
</template>
