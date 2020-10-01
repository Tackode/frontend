import { Place } from './Place'

export type Checkin = {
  id: string
  startTimestamp: string
  endTimestamp: string
  duration: number
  potentialInfection: boolean
  place: Place
}
