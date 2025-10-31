// types.ts

export interface Comment {
  id?: number
  newsId: number
  text: string
  vote: 'true' | 'false'
  createdAt: string
  images?: string[]
}

export interface News {
  id: number
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
  news: News
}

export interface Reporter{

 id: number
 name: string
 roles: string[]

}