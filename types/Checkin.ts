import { Place } from './Place'

export interface Checkin {
  id: string
  timestamp: string
  duration: number
  place: Place
  potential_infection: boolean
}
