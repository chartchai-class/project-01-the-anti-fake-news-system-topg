<template>
  <div v-if="authStore.user && authStore.user.roles.length > 0" class="max-w-3xl mx-auto p-6">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">My Profile</h2>

    <div v-if="loading" class="text-gray-500 text-center py-10">
      Loading profile...
    </div>

    <div v-else class="space-y-4 bg-white shadow p-6 rounded-lg border">
      <div><strong>ID:</strong> {{ user.id }}</div>
      <div><strong>Name:</strong> {{ user.name }}</div>
      <div><strong>Email:</strong> {{ user.email }}</div>
      <div><strong>Username:</strong> {{ user.username }}</div>
      <div><strong>Roles:</strong> {{ user.roles?.join(', ') }}</div>
    </div>
  </div>

  <div v-else class="text-center p-10 text-red-500 font-semibold">
    ❌ Access Denied — You do not have permission to view this page
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
