import apiClient from './AxiosClient'
import type { News } from '@/types'

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

  getNewsByKeyword(keyword: string, perPage: number, page: number, status: string = 'all') {
    let url = `/news/search?query=${encodeURIComponent(keyword)}&_limit=${perPage}&_page=${page}`
    if (status !== 'all') url += `&status=${status}`
    return apiClient.get<News[]>(url)
  },
}
