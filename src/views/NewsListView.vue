<script setup lang="ts">
import NewsCard from '@/components/NewsCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import { type News } from '@/types'
import { ref, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NewsService from '@/services/NewsService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const newsList = ref<News[]>([])
const totalVisibleNews = ref(0) // total news visible to the current user

const props = defineProps({
  page: { type: Number, required: true },
  size: { type: Number, required: true },
})

const page = computed(() => Number(route.query.page) || props.page)
const selectedSize = ref(props.size)
const selectedType = ref((route.query.status as string) || 'all')
const keyword = ref('')

async function fetchNews() {
  const isAdmin = authStore.user?.roles.includes('ROLE_ADMIN')
  const statusParam = selectedType.value

  let response
  if (keyword.value.trim() === '') {
    response = await NewsService.getNews(selectedSize.value, page.value, statusParam, isAdmin)
  } else {
    response = await NewsService.getNewsByKeyword(
      keyword.value.trim(),
      selectedSize.value,
      page.value,
      statusParam
    )
  }

  if (!response.data) {
    newsList.value = []
    totalVisibleNews.value = 0
    return
  }

  // No filtering needed - backend handles it for non-admins
  newsList.value = response.data

  // Get total count from header
  totalVisibleNews.value = parseInt(response.headers['x-total-count'])
}

watchEffect(() => {
  fetchNews()
})

function changeSize() {
  router.push({
    name: 'news-list-view',
    query: {
      page: 1,
      size: selectedSize.value,
      status: selectedType.value,
    },
  })
}

const hasNextPage = computed(() => {
  return page.value * selectedSize.value < totalVisibleNews.value
})

function handleDelete(newsId: number) {
  if (!confirm('Are you sure you want to delete this news item?')) return
  NewsService.deleteNews(newsId)
    .then(() => fetchNews())
    .catch(() => alert('Failed to delete news.'))
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-black text-white">
    <!-- Top controls bar -->
    <div class="p-4 bg-gradient-to-r from-[rgb(28,28,30)] to-[rgb(38,38,40)] shadow-md rounded-b-xl">
      <div class="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
        <span v-if="authStore.isAdmin || authStore.isReporter">
          <RouterLink
            :to="{ name: 'add-news' }"
          >
            Add News
          </RouterLink>
        </span>

            class="px-4 py-1.5 text-sm md:text-base bg-[rgb(28,28,30)] text-white rounded-lg hover:border-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
        <div class="w-64">
          <div class="relative">
            <input
              id="search"
              type="text"
              v-model="keyword"
              @input="fetchNews"
              placeholder="Type to search..."
              class="w-full pl-3 pr-10 py-3 rounded-lg bg-[rgb(28,28,30)] text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <!-- Optional search icon -->
            <svg
              class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
        </div>

        <div class="border-l border-gray-600 h-6 hidden md:block"></div>

        <div class="flex items-center gap-2">
          <label for="status" class="text-sm md:text-base font-semibold text-gray-300">News type:</label>
          <select
            id="status"
            v-model="selectedType"
            @change="
              router.push({
                name: 'news-list-view',
                query: { page: 1, size: selectedSize, status: selectedType },
              })
            "
            class="border border-gray-600 rounded-lg  px-4 py-2 text-sm md:text-base bg-[rgb(28,28,30)] text-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
          >
            <option value="all">All news</option>
            <option value="True">True news</option>
            <option value="False">Fake news</option>
            <option value="Pending">Pending news</option>
          </select>
        </div>

        <div class="border-l border-gray-600 h-6 hidden md:block"></div>

        <div class="flex items-center gap-2">
          <label for="size" class="text-sm md:text-base font-semibold text-gray-300">News per page:</label>
          <select
            id="size"
            v-model.number="selectedSize"
            @change="changeSize"
            class="border border-gray-600 rounded-lg px-4 py-2 text-sm md:text-base bg-[rgb(28,28,30)] text-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
          >
            <option :value="3">3</option>
            <option :value="6">6</option>
            <option :value="12">12</option>
            <option :value="24">24</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex-1 p-6">
      <div class="flex flex-wrap justify-center gap-4 mb-6">
        <NewsCard
          v-for="news in newsList"
          :key="news.id"
          :news="news"
          @delete="handleDelete"
        />
      </div>

      <div class="flex justify-center gap-8 text-base">
        <RouterLink
          id="page-prev"
          :to="{
            name: 'news-list-view',
            query: { page: page - 1, size: selectedSize, status: selectedType },
          }"
          rel="prev"
          class="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 hover:-translate-x-2 transition-all duration-200"
          v-if="page != 1"
        >
          &#60; Prev Page
        </RouterLink>

        <RouterLink
          id="page-next"
          :to="{
            name: 'news-list-view',
            query: { page: page + 1, size: selectedSize, status: selectedType },
          }"
          rel="next"
          class="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 hover:translate-x-2 transition-all duration-200"
          v-if="hasNextPage"
        >
          Next Page &#62;
        </RouterLink>
      </div>
    </div>
  </div>
</template>