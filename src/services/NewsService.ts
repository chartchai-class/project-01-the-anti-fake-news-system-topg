import apiClient from './AxiosClient'
import type { News } from '@/types'
import axios from 'axios'


const API_URL = import.meta.env.VITE_BACKEND_URL

export default {
  getNews(perPage: number, page: number, status: string = 'all') {
    let url = `/news?_limit=${perPage}&_page=${page}`
    if (status !== 'all') url += `&status=${status}`
    return apiClient.get<News[]>(url)
  },

  getAdminNews(perPage: number, page: number, status: string = 'all') {
    let url = `/news/admin?_limit=${perPage}&_page=${page}`
    if (status !== 'all') url += `&status=${status}`
    return apiClient.get<News[]>(url)
  },

  getNewsItem(id: number) {
    return apiClient.get<News>(`/news/${id}`)
  },

  // This one is for the vote count display, not for voting
  voteNews(id: number, trueVotes: number, falseVotes: number) {
    return apiClient.patch<News>(`/news/${id}`, { trueVotes, falseVotes })
  },

  saveNews(news: News) {
    return apiClient.post<News>('/news', news)
  },

  getNewsByKeyword(keyword: string, perPage: number, page: number, status: string = 'all') {
    let url = `/news/search?query=${encodeURIComponent(keyword)}&_limit=${perPage}&_page=${page}`
    if (status !== 'all') url += `&status=${status}`
    return apiClient.get<News[]>(url)
  },

  deleteNews(id: number) {
    return apiClient.patch(`/news/${id}/delete`)
  },

  // Add hideNews method
  hideNews(newsId: number, hidden: boolean) {
    return axios.patch(`${API_URL}/news/${newsId}/hide`, { hidden })
  }
}
