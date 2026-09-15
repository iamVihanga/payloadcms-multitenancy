import type { Access } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import { extractID } from '@/utilities/extractID'

/** Super admins create anyone. Tenant-admins create users inside their own tenants. */
export const createAccess: Access = ({ req }) => {
  const { user } = req
  if (!user || user.collection !== 'users') return false
  if (isSuperAdmin(user)) return true

  // nobody but a super admin may mint a super admin
  if (req.data?.roles?.includes('super-admin')) return false

  const manageable = getUserTenantIDs(user, 'tenant-admin')
  if (manageable.length === 0) return false

  const requested: (number | string)[] =
    req.data?.tenants?.map((row: { tenant: unknown }) => extractID(row.tenant as never)) ?? []

  return requested.length > 0 && requested.every((id) => manageable.includes(id))
}
