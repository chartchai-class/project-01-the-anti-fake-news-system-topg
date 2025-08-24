<script setup lang="ts">
import { defineProps } from 'vue'
import { type News } from '@/types'

// ✅ Props typing (clean, no TS errors)
const { news } = defineProps<{ news: News }>()
</script>

<template>
  <!-- Center wrapper -->
  <div class="flex justify-center items-start py-6">
    <!-- Card -->
    <div class="max-w-md w-full bg-white shadow-md rounded-2xl p-6 border border-gray-200 mx-auto">
      
      <!-- Status -->
      <p
        class="text-sm font-semibold mb-2"
        :class="{
          'text-green-600': news.trueVotes > news.falseVotes,
          'text-red-600': news.falseVotes > news.trueVotes,
          'text-gray-500': news.trueVotes === news.falseVotes
        }"
      >
        Status:
        {{ news.trueVotes > news.falseVotes ? "Mostly True" : news.falseVotes > news.trueVotes ? "Mostly False" : "Pending" }}
      </p>

      <!-- Title -->
      <h2 class="text-xl font-bold text-gray-800 mb-2">
        {{ news.topic }}
      </h2>

      <!-- Reporter & Date -->
      <div class="text-sm text-gray-500 mb-4">
        Reported by <span class="font-medium">{{ news.reporter }}</span> <br />
        {{ news.date }} @ {{ news.time }}
      </div>

      <!-- Short detail -->
      <p class="text-gray-700 leading-relaxed mb-4">
        {{ news.short_detail }}
      </p>

      <!-- Tally -->
      <div class="bg-gray-50 rounded-lg p-3 text-sm">
        <p class="text-green-700">
          True Votes: <strong>{{ news.trueVotes }}</strong>
        </p>
        <p class="text-red-700">
          False Votes: <strong>{{ news.falseVotes }}</strong>
        </p>
        <p class="mt-2">
          Verdict:
          <span
            class="font-bold"
            :class="{
              'text-green-600': news.trueVotes > news.falseVotes,
              'text-red-600': news.falseVotes > news.trueVotes,
              'text-gray-600': news.trueVotes === news.falseVotes
            }"
          >
            {{ news.trueVotes > news.falseVotes ? "Mostly True" : news.falseVotes > news.trueVotes ? "Mostly False" : "Pending" }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
