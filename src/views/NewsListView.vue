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

//News type selector
const selectedType = ref((router.currentRoute.value.query.status as string) || 'all')

//Fetch ALL news once (big limit)
watchEffect(() => {
  NewsService.getNews(9999, 1)
    .then((response) => {
      newsList.value = response.data
    })
    .catch((error) => {
      console.error('There was an error fetching news!', error)
    })
})

//Filter based on votes
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

//Paginate after filtering
const paginatedNews = computed(() => {
  if (!filteredNews.value) return []
  const start = (page.value - 1) * selectedSize.value
  const end = start + selectedSize.value
  return filteredNews.value.slice(start, end)
})

//Has next page
const hasNextPage = computed(() => {
  const totalPages = Math.ceil(filteredNews.value.length / selectedSize.value)
  return page.value < totalPages
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-black text-white">
    <!-- Top controls bar -->
    <div class="p-4 bg-[rgb(28,28,30)] shadow-md">
      <div class="flex justify-center gap-8">
        <!-- News type selector -->
        <div class="flex items-center gap-2">
          <label for="status" class="text-sm font-medium">News type:</label>
          <select
            id="status"
            v-model="selectedType"
            @change="
              router.push({
                name: 'news-list-view',
                query: { page: 1, size: selectedSize, status: selectedType },
              })
            "
            class="border border-gray-500 rounded px-2 py-1 text-sm bg-[rgb(28,28,30)] text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All news</option>
            <option value="True">True news</option>
            <option value="False">Fake news</option>
            <option value="Pending">Pending news</option>
          </select>
        </div>

        <!-- Page size selector -->
        <div class="flex items-center gap-2">
          <label for="size" class="text-sm font-medium">News per page:</label>
          <select
            id="size"
            v-model.number="selectedSize"
            @change="changeSize"
            class="border border-gray-500 rounded px-2 py-1 text-sm bg-[rgb(28,28,30)] text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <NewsCard v-for="news in paginatedNews" :key="news.id" :news="news" />
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
          class="hover:underline"
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
          class="hover:underline"
          v-if="hasNextPage"
        >
          Next Page &#62;
        </RouterLink>
      </div>
    </div>
  </div>
</template>
