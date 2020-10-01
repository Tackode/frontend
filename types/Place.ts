import { Organization } from './Organization'

export type Place = {
  id: string
  organization: Organization
  name: string
  description: string | null
  averageDuration: number
}
