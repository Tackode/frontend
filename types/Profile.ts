import { Organization } from './Organization'

export interface Profile {
  id: string
  email: string | null
  organization: Organization | null
}
