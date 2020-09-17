import { Organization } from './Organization'

export interface InfectionCreation {
  placesIds: String[]
  startDate: Date | null
  startTime: string
  startTimestamp: string
  endDate: Date | null
  endTime: string
  endTimestamp: string
}

export interface Infection {
  id: string
  organization: Organization
  placesIds: String[]
  startTimestamp: string
  endTimestamp: string
}
