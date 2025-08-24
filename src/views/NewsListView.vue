<script setup lang="ts">
import NewsCard from '@/components/NewsCard.vue'
import { type News } from '@/types'
import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import NewsService from '@/services/NewsService'

const newsList = ref<News[] | null>(null)

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
})

const page = computed(() => props.page)
const selectedSize = ref(props.size)

const router = useRouter()

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

// News type selector
const selectedType = ref((router.currentRoute.value.query.status as string) || 'all')

// Fetch ALL news once (no pagination on backend)
watchEffect(() => {
  NewsService.getNews(9999, 1) // fetch a big number to get all
    .then((response) => {
      newsList.value = response.data
    })
    .catch((error) => {
      console.error('There was an error fetching news!', error)
    })
})

// ✅ Step 1: Filter based on votes
const filteredNews = computed(() => {
  if (!newsList.value) return []

  switch (selectedType.value) {
    case 'True':
      return newsList.value.filter((n) => n.trueVotes > n.falseVotes)

    case 'False':
      return newsList.value.filter((n) => n.falseVotes > n.trueVotes)

    case 'Pending':
      return newsList.value.filter((n) => n.trueVotes === n.falseVotes)

    default:
      return newsList.value
  }
})

// ✅ Step 2: Paginate after filtering
const paginatedNews = computed(() => {
  if (!filteredNews.value) return []
  const start = (page.value - 1) * selectedSize.value
  const end = start + selectedSize.value
  return filteredNews.value.slice(start, end)
})

const hasNextPage = computed(() => {
  const totalPages = Math.ceil(filteredNews.value.length / selectedSize.value)
  return page.value < totalPages
})
</script>

<template>
  <h1 class="text-4xl mb-8">Latest News</h1>

  <!-- News Status Selector -->
  <div class="mb-4">
    <label for="status" class="mr-2 text-base font-medium text-gray-700">News type:</label>
    <select
      id="status"
      v-model="selectedType"
      @change="
        router.push({
          name: 'news-list-view',
          query: { page: 1, size: selectedSize, status: selectedType },
        })
      "
      class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="all">All news</option>
      <option value="True">True news</option>
      <option value="False">Fake news</option>
      <option value="Pending">Pending news</option>
    </select>
  </div>

  <!-- Size selector -->
  <div class="mb-4">
    <label for="size" class="mr-2 text-base font-medium text-gray-700">News per page:</label>
    <select
      id="size"
      v-model.number="selectedSize"
      @change="changeSize"
      class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option :value="2">2</option>
      <option :value="3">3</option>
      <option :value="5">5</option>
      <option :value="10">10</option>
    </select>
  </div>

  <div class="flex flex-col items-center gap-4">
    <!-- Horizontal news cards -->
    <div class="flex flex-wrap gap-4 justify-center">
      <!-- ✅ Use paginatedNews -->
      <NewsCard v-for="news in paginatedNews" :key="news.id" :news="news" />
    </div>

    <!-- Pagination -->
    <div class="flex justify-between w-[290px] text-base mt-4">
      <RouterLink
        id="page-prev"
        :to="{
          name: 'news-list-view',
          query: { page: page - 1, size: selectedSize, status: selectedType },
        }"
        rel="prev"
        class="flex-1 text-left no-underline text-[#2c3e50] font-medium hover:underline"
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
        class="flex-1 text-right no-underline text-[#2c3e50] font-medium hover:underline"
        v-if="hasNextPage"
      >
        Next Page &#62;
      </RouterLink>
    </div>
  </div>
</template>
