<script setup lang="ts">
import { defineProps } from 'vue'
import { type News } from '@/types'

const { news } = defineProps<{ news: News }>()
</script>

<template>
  <!-- Page Background -->
  <div class="min-h-screen bg-gray-900 flex justify-center items-start pt-6 pb-6">
    <!-- Card -->
    <div class="w-[95%] sm:w-[90%] lg:w-[80%] max-w-4xl bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      
      <!-- Title -->
      <h2 class="text-2xl sm:text-3xl font-bold text-white">
        {{ news.topic }}
      </h2>

      <!-- Reporter & Date -->
      <div class="text-sm sm:text-base text-gray-400">
        Reported by <span class="font-medium text-white">{{ news.reporterName }}</span>  
        <span class="block">{{ news.date }} @ {{ news.time }}</span>
      </div>

      <!-- Long Detail -->
      <p class="text-gray-200 text-sm sm:text-base leading-relaxed text-justify">
        {{ news.longDetail }}
      </p>

      <!-- Tally / Verdict -->
      <div class="bg-gray-700 rounded-lg p-4 text-sm sm:text-base flex flex-col gap-2">
        <div class="flex justify-between">
          <span class="text-green-400 font-semibold">True Votes:</span>
          <span class="text-white font-bold">{{ news.trueVotes }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-red-400 font-semibold">False Votes:</span>
          <span class="text-white font-bold">{{ news.falseVotes }}</span>
        </div>
        <div class="mt-2 flex justify-between">
          <span class="text-white font-semibold">Verdict:</span>
          <span
            class="font-bold"
            :class="{
              'text-green-400': news.trueVotes > news.falseVotes,
              'text-red-400': news.falseVotes > news.trueVotes,
              'text-yellow-400': news.trueVotes === news.falseVotes
            }"
          >
            {{ news.trueVotes > news.falseVotes ? "Mostly True" : news.falseVotes > news.trueVotes ? "Mostly False" : "Pending" }}
          </span>
        </div>
      </div>
        <!-- Images at Bottom -->
        <div class="mt-4 flex flex-wrap gap-3 justify-center">
          <div
            v-for="image in news.images"
            :key="image"
            class="flex items-center justify-center overflow-hidden "
          >
            <img
              :src="image"
              alt="news image"
              class="border-solid border-gray-200 border-2 rounded p-1 m-1 hover:shadow-lg"
            />
          </div>
        </div>

    </div>
  </div>
</template>
