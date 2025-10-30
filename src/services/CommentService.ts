import apiClient from './AxiosClient'
import type { Comment } from '@/types'

export default {
  addComment(payload: Omit<Comment, 'id' | 'createdAt'>) {
    return apiClient.post<Comment>('/comments', {
      ...payload,
      createdAt: new Date().toISOString()
    })
  },

  getCommentsByNews(newsId: number) {
    return apiClient.get<Comment[]>('/comments', {
      params: { newsId, _sort: 'id', _order: 'desc' }
    })
  }
}
