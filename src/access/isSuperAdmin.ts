import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const isSuperAdmin = (user: unknown): boolean => {
  return Boolean((user as User | null)?.roles?.includes('super-admin'))
}

export const isSuperAdminAccess: Access = ({ req }) => isSuperAdmin(req.user)
