import type { Access } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import { isAccessingSelf } from './isAccessingSelf'

export const updateAndDeleteAccess: Access = ({ req, id }) => {
  const { user } = req
  if (!user || user.collection !== 'users') return false
  if (isSuperAdmin(user)) return true
  if (isAccessingSelf({ id, user })) return true

  const manageable = getUserTenantIDs(user, 'tenant-admin')

  if (manageable.length === 0) return false

  return { 'tenants.tenant': { in: manageable } }
}
