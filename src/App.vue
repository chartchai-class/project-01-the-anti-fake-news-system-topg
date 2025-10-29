<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMessageStore } from './stores/message'
import { storeToRefs } from 'pinia'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLogin, mdiAccountPlus } from '@mdi/js' // ✅ added both icons

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

      <!-- ✅ Unified Full-width Navbar -->
      <nav class="w-full bg-gray-800 shadow-md">
        <div class="max-w-6xl mx-auto flex justify-between items-center p-3">
          <!-- Left: Site Title -->
          <RouterLink
            class="font-semibold text-xl text-gray-300 hover:text-white transition transform hover:scale-105"
            exact-active-class="text-white"
            :to="{ name: 'news-list-view' }"
          >
            Anti Fake News
          </RouterLink>

          <!-- Right: Auth Links -->
          <ul class="flex items-center space-x-4">
            <li>
              <RouterLink
                to="/register"
                class="flex items-center text-gray-300 hover:text-white transition"
              >
                <SvgIcon type="mdi" :path="mdiAccountPlus" class="w-5 h-5" />
                <span class="ml-2">Sign Up</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/login"
                class="flex items-center text-gray-300 hover:text-white transition"
              >
                <SvgIcon type="mdi" :path="mdiLogin" class="w-5 h-5" />
                <span class="ml-2">Login</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
