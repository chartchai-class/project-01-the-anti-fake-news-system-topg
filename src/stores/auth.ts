import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { Reporter } from '@/types'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as Reporter | null,
  }),

  getters: {
    currentUserName(): string {
      return this.user?.name || ''
    },
  },

  actions: {
    login(email: string, password: string) {
      return apiClient
        .post('/api/v1/auth/authenticate', {
          username: email,
          password: password,
        })
        .then((response) => {
          this.token = response.data.access_token
          this.user = response.data.user
          localStorage.setItem('access_token', this.token as string)
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          localStorage.setItem('user', JSON.stringify(this.user))
          return response
        })
    },

    register(firstname: string, lastname: string, username: string, email: string, password: string) {
      return apiClient
        .post('/api/v1/auth/register', {
          firstname,
          lastname,
          username,
          email,
          password,
        })
        .then((response) => {
          // Registration succeeded; just return backend message
          return response.data
        })
    },

    logout() {
      console.log('logout')
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },

    reload(token: string, user: Reporter) {
      this.token = token
      this.user = user
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
  },
})
