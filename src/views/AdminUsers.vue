<template>
  <div v-if="authStore.isAdmin" class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">All Users</h2>

    <div v-if="loading" class="text-gray-500 text-center py-10">
      Loading users...
    </div>

    <div v-else-if="users.length === 0" class="text-gray-500 text-center py-10">
      No users found.
    </div>

    <table v-else class="w-full text-left border border-gray-300 rounded-lg shadow-sm">
      <thead class="bg-gray-200 text-gray-800">
        <tr>
          <th class="p-3 border">Name</th>
          <th class="p-3 border">Roles</th>
          <th class="p-3 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="p-3 border">{{ user.name }}</td>
          <td class="p-3 border">
            {{ (user.roles && user.roles.length > 0) ? user.roles.join(', ') : 'No roles' }}
          </td>
          <td class="p-3 border flex flex-wrap gap-2">
            <!-- Promote to Admin -->
            <button
              v-if="!user.roles?.includes('ROLE_ADMIN')"
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              @click="promote(user, 'ROLE_ADMIN')"
            >
              Promote to Admin
            </button>
            <span v-else class="text-gray-500">Already Admin</span>

            <!-- Promote to Reporter -->
            <button
              v-if="!user.roles?.includes('ROLE_REPORTER')"
              class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              @click="promote(user, 'ROLE_REPORTER')"
            >
              Promote to Reporter
            </button>
            <span v-else class="text-gray-500">Already Reporter</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 🔄 Manual refresh button -->
    <div class="text-center mt-6">
      <button
        class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        @click="fetchUsers"
      >
        Refresh User List
      </button>
    </div>
  </div>

  <div v-else class="text-center p-10 text-red-500 font-semibold">
    ❌ Access Denied — Admins Only
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { Reporter } from '@/types'

const authStore = useAuthStore()
const users = ref<Reporter[]>([])
const loading = ref(true)

// 🧩 reusable fetch function
async function fetchUsers() {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8080/admin/users', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    users.value = res.data
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}

// 🔁 load users when page mounts
onMounted(fetchUsers)

async function promote(user: Reporter, role: string) {
  try {
    await axios.patch(
      `http://localhost:8080/admin/users/${user.id}/promote?role=${role}`,
      null,
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    await fetchUsers() // ✅ refresh immediately after update
  } catch (err) {
    console.error(`Failed to promote user to ${role}:`, err)
  }
}
</script>
