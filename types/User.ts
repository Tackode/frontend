export type UserRole = 'Public' | 'Professional'

export type User = {
  id: string
  role: UserRole
  email: string
}
