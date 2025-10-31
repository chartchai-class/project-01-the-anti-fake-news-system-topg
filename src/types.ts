// types.ts

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
  reporterName: string
  date: string // format: YYYY-MM-DD
  time: string // format: HH:mm:ss
  comments?: Comment[]
  images: string[]
  hidden?: boolean 
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