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
  images: string[]
}

export interface MessageState {
  message: string
}

export interface NewsState {
  news: News | null
}

export interface Reporter{

 id: number | null
 name: string
 roles: string[]

}