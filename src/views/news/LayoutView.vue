<script setup lang="ts">
import { useNewsStore } from '@/stores/News'
import { storeToRefs } from 'pinia'

const store = useNewsStore()
const { news } = storeToRefs(store)
</script>

<template>
  <div v-if="news">
    <h1
      class="relative text-3xl sm:text-4xl font-extrabold text-white text-center p-4 rounded-lg mt-0 mb-0 overflow-hidden"
      :class="{
        'bg-gradient-to-r from-green-500 via-green-400 to-teal-400':
          news.trueVotes > news.falseVotes,
        'bg-gradient-to-r from-red-600 via-orange-500 to-red-400': news.falseVotes > news.trueVotes,
        'bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-200':
          news.trueVotes === news.falseVotes,
      }"
    >
      <span class="relative z-10">{{ news.topic }}</span>
      <span class="absolute inset-0 bg-black opacity-20 rounded-lg"></span>
    </h1>

    <nav class="mb-6 flex justify-center gap-6 bg-gray-800 rounded-lg p-3">
      <RouterLink
        class="font-semibold border-b-2 pb-1 transition-all duration-200"
        :to="{ name: 'news-detail-view' }"
        :class="{
          'text-green-400 border-green-400':
            news.trueVotes > news.falseVotes && $route.name === 'news-detail-view',
          'text-red-400 border-red-400':
            news.falseVotes > news.trueVotes && $route.name === 'news-detail-view',
          'text-yellow-400 border-yellow-400':
            news.trueVotes === news.falseVotes && $route.name === 'news-detail-view',
          'text-gray-300 border-transparent': $route.name !== 'news-detail-view',
          'hover:text-green-400 hover:border-green-400 hover:drop-shadow-[0_0_3px_rgba(0,255,0,0.4)]':
            news.trueVotes > news.falseVotes && $route.name !== 'news-detail-view',
          'hover:text-red-400 hover:border-red-400 hover:drop-shadow-[0_0_3px_rgba(255,0,0,0.4)]':
            news.falseVotes > news.trueVotes && $route.name !== 'news-detail-view',
          'hover:text-yellow-400 hover:border-yellow-400 hover:drop-shadow-[0_0_3px_rgba(255,255,0,0.4)]':
            news.trueVotes === news.falseVotes && $route.name !== 'news-detail-view',
        }"
      >
        Details
      </RouterLink>

      <RouterLink
        class="font-semibold border-b-2 pb-1 transition-all duration-200"
        :to="{ name: 'news-vote-view' }"
        :class="{
          'text-green-400 border-green-400':
            news.trueVotes > news.falseVotes && $route.name === 'news-vote-view',
          'text-red-400 border-red-400':
            news.falseVotes > news.trueVotes && $route.name === 'news-vote-view',
          'text-yellow-400 border-yellow-400':
            news.trueVotes === news.falseVotes && $route.name === 'news-vote-view',
          'text-gray-300 border-transparent': $route.name !== 'news-vote-view',
          'hover:text-green-400 hover:border-green-400 hover:drop-shadow-[0_0_3px_rgba(0,255,0,0.4)]':
            news.trueVotes > news.falseVotes && $route.name !== 'news-vote-view',
          'hover:text-red-400 hover:border-red-400 hover:drop-shadow-[0_0_3px_rgba(255,0,0,0.4)]':
            news.falseVotes > news.trueVotes && $route.name !== 'news-vote-view',
          'hover:text-yellow-400 hover:border-yellow-400 hover:drop-shadow-[0_0_3px_rgba(255,255,0,0.4)]':
            news.trueVotes === news.falseVotes && $route.name !== 'news-vote-view',
        }"
      >
        Vote
      </RouterLink>

      <RouterLink
        class="font-semibold border-b-2 pb-1 transition-all duration-200"
        :to="{ name: 'news-comment-view' }"
        :class="{
          'text-green-400 border-green-400':
            news.trueVotes > news.falseVotes && $route.name === 'news-comment-view',
          'text-red-400 border-red-400':
            news.falseVotes > news.trueVotes && $route.name === 'news-comment-view',
          'text-yellow-400 border-yellow-400':
            news.trueVotes === news.falseVotes && $route.name === 'news-comment-view',
          'text-gray-300 border-transparent': $route.name !== 'news-comment-view',
          'hover:text-green-400 hover:border-green-400 hover:drop-shadow-[0_0_3px_rgba(0,255,0,0.4)]':
            news.trueVotes > news.falseVotes && $route.name !== 'news-comment-view',
          'hover:text-red-400 hover:border-red-400 hover:drop-shadow-[0_0_3px_rgba(255,0,0,0.4)]':
            news.falseVotes > news.trueVotes && $route.name !== 'news-comment-view',
          'hover:text-yellow-400 hover:border-yellow-400 hover:drop-shadow-[0_0_3px_rgba(255,255,0,0.4)]':
            news.trueVotes === news.falseVotes && $route.name !== 'news-comment-view',
        }"
      >
        Comments
      </RouterLink>
    </nav>

    <RouterView :news="news" />
  </div>
</template>
