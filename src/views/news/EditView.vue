<script setup lang="ts">
import { ref, computed, toRefs, onMounted } from 'vue'
import { type News } from '@/types'

const props = defineProps<{ news: News; id: string }>()
const { news } = toRefs(props)

const filter = ref<'all' | 'true' | 'false'>('all')

const votedKey = computed(() => `voted:${news.value?.id}`)
const hasVoted = ref(false)

onMounted(() => {
  hasVoted.value = localStorage.getItem(votedKey.value) === '1'
  if (!news.value?.comments) news.value!.comments = []
})

const filteredComments = computed(() => {
  if (!news.value?.comments) return []
  if (filter.value === 'all') return news.value.comments
  return news.value.comments.filter(c => c.vote === filter.value)
})
</script>

<template>
  <div class="max-w-md w-full bg-white shadow-md rounded-2xl p-6 border border-gray-200 mx-auto mt-6">
    <!-- Header -->
    <h2 class="text-lg font-semibold mb-4 text-gray-800">Comments</h2>
    <!-- Filter buttons -->
    <div class="flex gap-2 mb-4">
      <button
        class="px-3 py-1 border rounded-lg"
        :class="{ 'font-semibold bg-gray-100': filter==='all' }"
        @click="filter='all'"
      >
        All
      </button>
      <button
        class="px-3 py-1 border rounded-lg"
        :class="{ 'font-semibold bg-gray-100': filter==='true' }"
        @click="filter='true'"
      >
        True
      </button>
      <button
        class="px-3 py-1 border rounded-lg"
        :class="{ 'font-semibold bg-gray-100': filter==='false' }"
        @click="filter='false'"
      >
        False
      </button>
    </div>

    <!-- Comment list -->
    <ul class="space-y-3">
      <li v-for="c in filteredComments" :key="c.id" class="flex items-start gap-3 border-b pb-3">
        <!-- Vote badge -->
        <span
          :class="c.vote==='true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          class="font-bold px-2 py-1 rounded-full text-sm flex-shrink-0"
        >
          {{ c.vote === 'true' ? 'True' : 'False' }}
        </span>

        <!-- Comment content -->
        <div class="flex-1">
          <p class="text-gray-800">{{ c.text }}</p>
          <img
            v-if="c.imageUrl"
            :src="c.imageUrl"
            alt="Comment image"
            class="mt-2 max-h-40 rounded-lg object-cover border"
          />
          <span class="text-xs text-gray-500 mt-1 block">{{ new Date(c.createdAt).toLocaleString() }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
