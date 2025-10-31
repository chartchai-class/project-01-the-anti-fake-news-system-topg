import apiClient from './AxiosClient'
import type { Comment } from '@/types'

export default {
  // Add a new comment
  addComment(payload: Omit<Comment, 'id' | 'createdAt' | 'hidden'>) {
    return apiClient.post<Comment>('/comments', {
      ...payload,
      createdAt: new Date().toISOString(),
      hidden: false, // default to visible
    })
  },

// Get all comments for a news item
  // Pass isAdmin=true to get hidden comments as well
  getCommentsByNews(newsId: number, isAdmin = false) {
    return apiClient.get<Comment[]>('/comments', {
      params: { newsId, admin: isAdmin, _sort: 'id', _order: 'desc' }
    })
  },

  // Hide/unhide a comment (admins only)
  hideComment(commentId: number, hidden?: boolean) {
    return apiClient.patch<Comment>(`/comments/hide/${commentId}`, null, {
      params: { hidden }
    })
  }
}