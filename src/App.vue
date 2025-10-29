<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMessageStore } from './stores/message'
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';
import { SpeedInsights } from '@vercel/speed-insights/vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLogin, mdiAccountPlus, mdiAccount, mdiLogout } from '@mdi/js'

const store = useMessageStore()
const authStore = useAuthStore()
const router = useRouter()
const { message } = storeToRefs(store)
const { currentUserName } = storeToRefs(authStore) // ✅ reactive getter

const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')

if (token && user) {
  authStore.reload(token, JSON.parse(user))  
} else {
  authStore.logout()
}

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
}
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

          <!-- ✅ Show when NOT logged in -->
          <ul v-if="!authStore.currentUserName" class="flex navbar-nav ml-auto">
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

          <!-- Show when LOGGED IN -->
<ul v-if="currentUserName" class="flex navbar-nav ml-auto">
  <li class="nav-item px-2">
    <RouterLink
      to="/profile"
      class="nav-link flex items-center text-gray-300 hover:text-white transition"
    >
      <SvgIcon type="mdi" :path="mdiAccount" />
      <span class="ml-3">{{ currentUserName }}</span>
    </RouterLink>
  </li>
  <li class="nav-item px-2">
    <a
      class="nav-link hover:cursor-pointer flex items-center text-gray-300 hover:text-white transition"
      @click="logout"
    >
      <SvgIcon type="mdi" :path="mdiLogout" />
      <span class="ml-3">Log Out</span>
    </a>
  </li>
</ul>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
