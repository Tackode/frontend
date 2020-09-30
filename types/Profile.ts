import { Organization } from './Organization'
import { UserRole } from './User'

export type Profile = {
  id: string
  role: UserRole
  email: string
  organization: Organization | null
}
