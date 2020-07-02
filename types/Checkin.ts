import { Place } from './Place'

export interface Checkin {
  id: string
  startTimestamp: Date
  duration: number
  place: Place
  potentialInfection: boolean
}
