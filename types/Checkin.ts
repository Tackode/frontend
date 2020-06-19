import { Place } from './Place'

export interface Checkin {
  id: string
  start_timestamp: Date
  duration: number
  place: Place
  potential_infection: boolean
}
