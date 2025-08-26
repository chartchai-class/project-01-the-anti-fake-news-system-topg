<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMessageStore } from './stores/message'
import { storeToRefs } from 'pinia'
import { SpeedInsights } from '@vercel/speed-insights/vue'
const store = useMessageStore()
const { message } = storeToRefs(store)
</script>

<template>
  <SpeedInsights />
  <div class="min-h-screen bg-[rgb(38,38,40)] font-sans text-gray-300 antialiased">
    <header>
      <div id="flashMessage" class="animate-fade" v-if="message">
        <h4>{{ message }}</h4>
      </div>

      <!-- Full-width nav -->
      <nav class="w-full bg-gray-800 shadow-md">
        <div class="max-w-4xl mx-auto flex justify-center p-3">
          <RouterLink
            class="font-semibold text-gray-300 hover:text-white transition"
            exact-active-class="text-green-400 border-b-2 border-green-400 pb-1"
            :to="{ name: 'news-list-view' }"
          >
            Anti Fake News
          </RouterLink>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

