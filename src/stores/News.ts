import type { NewsState, News } from '@/types'
import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    news: {
      id: 0,
      topic: '',
      shortDetail: '',
      longDetail: '',
      trueVotes: 0,
      falseVotes: 0,
      reporterName: '',
      date: '',
      time: '',
      comments: [],
      images: [],
      hidden: false,
    },
  }),
  actions: {
    setNews(news: News): void {
      this.news = news
    },
  },
})
