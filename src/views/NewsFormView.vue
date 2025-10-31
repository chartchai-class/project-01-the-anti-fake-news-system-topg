<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { News } from '@/types'
import NewsService from '@/services/NewsService'
import BaseInput from '@/components/BaseInput.vue'
import ImageUpload from '@/components/ImageUpload.vue'

const news = ref<News>({
  id: null,
  topic: '',
  shortDetail: '',
  longDetail: '',
  trueVotes: 0,
  falseVotes: 0,
  reporterName: null as any,
  date: '',
  time: '',
  comments: [],
  images: []
})

const router = useRouter()

function saveNews() {
  NewsService.saveNews(news.value)
    .then((response) => {
      router.push({ name: 'news-detail-view', params: { id: response.data.id } })
    })
    .catch((err) => {
      console.error(err)
      router.push({ name: 'network-error-view' })
    })
}
</script>

<template>
  <div class="min-h-screen bg-[#1a1a1d] text-gray-200 flex flex-col items-center py-12 px-4">
    <div class="w-full max-w-2xl bg-[#161618] rounded-2xl shadow-2xl p-10 border border-[#1e1e20]">
      <h1 class="text-4xl font-semibold mb-10 text-center text-gray-100 tracking-tight">
        📰 Create a News Item
      </h1>

      <form @submit.prevent="saveNews" class="space-y-8">
        <!-- Topic -->
        <BaseInput v-model="news.topic" label="Topic" />

        <!-- Short Detail -->
        <BaseInput v-model="news.shortDetail" label="Short Detail" />

        <!-- Long Detail -->
        <BaseInput v-model="news.longDetail" label="Long Detail" type="textarea" rows="6" />

        <!-- Date & Time (manually styled) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-400 mb-2">Date</label>
            <input
              v-model="news.date"
              type="date"
              class="w-full h-14 bg-[#2a2a2e] text-gray-100 border border-[#1c1c1f] rounded-xl px-4 py-2 placeholder-gray-500 hover:bg-[#323236] hover:border-[#29292c] transition-all duration-200"
            />
          </div>
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-400 mb-2">Time</label>
            <input
              v-model="news.time"
              type="time"
              class="w-full h-14 bg-[#2a2a2e] text-gray-100 border border-[#1c1c1f] rounded-xl px-4 py-2 placeholder-gray-500 hover:bg-[#323236] hover:border-[#29292c] transition-all duration-200"
            />
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <h3 class="text-lg font-medium text-gray-300 mb-3">Event Image</h3>
          <div class="bg-[#2a2a2e] p-4 rounded-xl border border-[#1c1c1f] hover:bg-[#323236] hover:border-[#29292c] transition-all">
            <ImageUpload v-model="news.images" />
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all duration-200 text-gray-100 font-medium py-3 rounded-xl shadow-lg"
        >
          Submit News
        </button>


      </form>

    </div>
  </div>
</template>
