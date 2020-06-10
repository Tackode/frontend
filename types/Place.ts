import { Organization } from './Organization'

export interface Place {
  id: string
  organization: Organization
  name: string
  description: string | null
  averageDuration: number
}
