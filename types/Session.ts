import { User } from './User'

export type Session = {
  id: string
  confirmed: boolean
}

export type Credentials = {
  login: string
  token: string
  user: User
}
