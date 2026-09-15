import type { Access } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'

/** A tenant-admin may edit their own business. Nobody else may edit any. */
export const tenantAdminUpdate: Access = ({ req }) => {
  if (!req.user || req.user.collection !== 'users') return false

  if (isSuperAdmin(req.user)) return true

  const manageable = getUserTenantIDs(req.user, 'tenant-admin')

  if (manageable.length === 0) return false

  return { id: { in: manageable } }
}
