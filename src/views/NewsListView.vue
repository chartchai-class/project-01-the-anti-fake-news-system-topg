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

// Reactive news data
const newsList = ref<News[]>([])
const totalNews = ref(0)

// Props for default page and size
const props = defineProps({
  page: { type: Number, required: true },
  size: { type: Number, required: true },
})

// Reactive selected page and size from route query
const page = computed(() => Number(route.query.page) || props.page)
const selectedSize = ref(props.size)

// News type selector (all, True, False, Pending)
const selectedType = ref((route.query.status as string) || 'all')

// Keyword search
const keyword = ref('')

// Fetch news from backend
function fetchNews() {
  const statusParam = selectedType.value
  const isAdmin = authStore.user?.roles.includes('ROLE_ADMIN')

  let queryFunction

  if (keyword.value.trim() === '') {
    queryFunction = NewsService.getNews(selectedSize.value, page.value, statusParam, isAdmin)
  } else {
    queryFunction = NewsService.getNewsByKeyword(
      keyword.value.trim(),
      selectedSize.value,
      page.value,
      statusParam
    )
  }

  queryFunction
    .then((response) => {
      let fetchedNews: News[] = response.data

      // Hide news with hidden=true for non-admins
      if (!isAdmin) {
        fetchedNews = fetchedNews.filter(n => !n.hidden)
      }

      newsList.value = fetchedNews

      // Update total count for pagination
      totalNews.value = isAdmin
        ? parseInt(response.headers['x-total-count'])
        : fetchedNews.length
    })
    .catch(() => {
      router.push({ name: 'NetworkError' })
    })
}

// Automatically fetch news when page, size, type, or keyword changes
watchEffect(() => {
  fetchNews()
})

// Change page size
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

// Pagination
const hasNextPage = computed(() => {
  return page.value * selectedSize.value < totalNews.value
})

// Delete news
function handleDelete(newsId: number) {
  if (!confirm('Are you sure you want to delete this news item?')) return
  NewsService.deleteNews(newsId)
    .then(() => {
      fetchNews()
    })
    .catch((err) => {
      console.error(err)
      alert('Failed to delete news.')
    })
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-black text-white">
    <!-- Top controls bar -->
    <div class="p-4 bg-gradient-to-r from-[rgb(28,28,30)] to-[rgb(38,38,40)] shadow-md rounded-b-xl">
      <div class="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
        <span v-if="authStore.isAdmin || authStore.isReporter">
          <!-- Add News button -->
          <RouterLink
            :to="{ name: 'add-news' }"
            class="px-4 py-1.5 text-sm md:text-base bg-[rgb(28,28,30)] text-white rounded-lg hover:border-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
          >
            Add News
          </RouterLink>
        </span>

        <!-- Search bar -->
        <div class="w-64">
          <BaseInput v-model="keyword" label="Search News" @input="fetchNews" />
        </div>

        <!-- Divider -->
        <div class="border-l border-gray-600 h-6 hidden md:block"></div>

        <!-- News type selector -->
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
            class="border border-gray-600 rounded-lg px-3 py-1.5 text-sm md:text-base bg-[rgb(28,28,30)] text-white hover:border-gray-400 transition shadow-sm"
          >
            <option value="all">All news</option>
            <option value="True">True news</option>
            <option value="False">Fake news</option>
            <option value="Pending">Pending news</option>
          </select>
        </div>

        <!-- Divider -->
        <div class="border-l border-gray-600 h-6 hidden md:block"></div>

        <!-- Page size selector -->
        <div class="flex items-center gap-2">
          <label for="size" class="text-sm md:text-base font-semibold text-gray-300">News per page:</label>
          <select
            id="size"
            v-model.number="selectedSize"
            @change="changeSize"
            class="border border-gray-600 rounded-lg px-3 py-1.5 text-sm md:text-base bg-[rgb(28,28,30)] text-white hover:border-gray-400 transition shadow-sm"
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
      <!-- News cards -->
      <div class="flex flex-wrap justify-center gap-4 mb-6">
        <NewsCard
          v-for="news in newsList"
          :key="news.id"
          :news="news"
          @delete="handleDelete"
        />
      </div>

      <!-- Pagination at bottom -->
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
