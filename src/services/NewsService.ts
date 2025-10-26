import axios from 'axios'
import type { News } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
})

export default {
  getNews(perPage: number, page: number, status: string = 'all') {
    let url = `/news?_limit=${perPage}&_page=${page}`
    if (status !== 'all') url += `&status=${status}`
    return apiClient.get<News[]>(url)
  },

  getNewsItem(id: number) {
    return apiClient.get<News>(`/news/${id}`)
  },

  voteNews(id: number, trueVotes: number, falseVotes: number) {
    return apiClient.patch<News>(`/news/${id}`, { trueVotes, falseVotes })
  },

  saveNews(news: News) {
    return apiClient.post<News>('/news', news)
  },
}
