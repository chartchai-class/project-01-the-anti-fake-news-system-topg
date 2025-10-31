<template>
  <div v-if="authStore.user && authStore.user.roles.length > 0" class="min-h-screen bg-gray-900 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-white">My Profile</h2>

      <div v-if="loading" class="text-gray-400 text-center py-16">
        <div class="inline-block animate-pulse">Loading profile...</div>
      </div>

      <div v-else class="bg-gray-800 shadow-xl rounded-lg border border-gray-700 overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white">Account Information</h3>
        </div>

        <!-- Profile Details -->
        <div class="p-6 space-y-4">
          <div class="flex items-start border-b border-gray-700 pb-4">
            <span class="text-gray-400 font-medium w-32 flex-shrink-0">ID:</span>
            <span class="text-white">{{ user.id }}</span>
          </div>

          <div class="flex items-start border-b border-gray-700 pb-4">
            <span class="text-gray-400 font-medium w-32 flex-shrink-0">Name:</span>
            <span class="text-white">{{ user.name }}</span>
          </div>

          <div class="flex items-start border-b border-gray-700 pb-4">
            <span class="text-gray-400 font-medium w-32 flex-shrink-0">Email:</span>
            <span class="text-white">{{ user.email }}</span>
          </div>

          <div class="flex items-start border-b border-gray-700 pb-4">
            <span class="text-gray-400 font-medium w-32 flex-shrink-0">Username:</span>
            <span class="text-white">{{ user.username }}</span>
          </div>

          <div class="flex items-start">
            <span class="text-gray-400 font-medium w-32 flex-shrink-0">Roles:</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="role in user.roles"
                :key="role"
                class="inline-block bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ role }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons (optional) -->
        <div class="bg-gray-750 px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
          <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-200">
            Edit Profile
          </button>
          <button class="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 rounded transition-colors duration-200">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="text-center p-10 bg-red-900 bg-opacity-20 border-2 border-red-800 rounded-lg max-w-md">
      <div class="text-6xl mb-4">🚫</div>
      <h3 class="text-2xl font-bold text-red-400 mb-2">Access Denied</h3>
      <p class="text-red-300">You do not have permission to view this page</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref(authStore.user ?? {})
const loading = ref(true)

onMounted(async () => {
  // Only fetch from backend if user has at least one role
  if (!authStore.user || !authStore.user.roles.length) {
    loading.value = false
    return
  }

  try {
    const res = await axios.get('http://localhost:8080/api/profile', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    user.value = res.data
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  } finally {
    loading.value = false
  }
})
</script>
