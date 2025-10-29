import axios from 'axios'
import type { Comment } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
})

// Use this one for the votes as well as the comments
// since votes are now part of comments.
// And make sure the backend handles payloads properly
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
