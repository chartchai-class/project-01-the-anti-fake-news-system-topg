import axios from 'axios'
import type { News } from '@/types'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getNews(perPage: number, page: number, status: string = 'all') {
    let url = `/news?_limit=${perPage}&_page=${page}`
    if (status !== 'all') {
      url += `&status=${status}`
    }
    return apiClient.get(url)
  },

  getNewsItem(id: number) {
    return apiClient.get('/news/' + id)
  },

  voteNews(id: number, trueVotes: number, falseVotes: number) {
    return apiClient.patch<News>(`/news/${id}`, {
      trueVotes,
      falseVotes
    })
  }
}
