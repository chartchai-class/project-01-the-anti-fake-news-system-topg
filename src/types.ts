export interface Comment {
  id?: number
  newsId: number
  text: string
  vote: 'true' | 'false'
  createdAt: string
  imageUrl?: string | null
}

export interface News {
  id: number | null
  topic: string
  shortDetail: string
  longDetail: string
  trueVotes: number
  falseVotes: number
  reporter: string
  date: string // format: YYYY-MM-DD
  time: string // format: HH:mm:ss
  comments?: Comment[]
  imageUrl?: string | null
}

export interface MessageState {
  message: string
}

export interface NewsState {
  news: News | null
}
