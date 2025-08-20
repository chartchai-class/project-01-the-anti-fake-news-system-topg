export interface News {
  id: number
  topic: string
  short_detail: string
  trueVotes: number
  falseVotes: number
  reporter: string
  date: string // format: YYYY-MM-DD
  time: string // format: HH:mm:ss
}

export interface MessageState {
  message: string
}

export interface NewsState {
  news: News | null
}
