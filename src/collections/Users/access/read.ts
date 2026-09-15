import type { Access, Where } from 'payload'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import { isAccessingSelf } from './isAccessingSelf'

export const readAccess: Access = ({ req, id }) => {
  const { user } = req
  if (!user || user.collection !== 'users') return false
  if (isAccessingSelf({ id, user })) return true

  const superAdmin = isSuperAdmin(user)
  const selected = getTenantFromCookie(req.headers, req.payload.db.defaultIDType)
  const manageable = getUserTenantIDs(user, 'tenant-admin')

  // viewing one tenant in the panel: scope the user list to it
  if (selected && (superAdmin || manageable.includes(selected))) {
    return { 'tenants.tenant': { equals: selected } }
  }

  if (superAdmin) return true

  return {
    or: [{ id: { equals: user.id } }, { 'tenants.tenant': { in: manageable } }],
  } as Where
}
