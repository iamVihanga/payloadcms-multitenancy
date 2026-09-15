import type { Tenant, User } from '@/payload-types'
import { extractID } from './extractID'

export type TenantRole = 'tenant-admin' | 'tenant-viewer'

export const getUserTenantIDs = (user: null | User, role?: TenantRole): Tenant['id'][] => {
  if (!user) return []

  return (user.tenants ?? []).reduce<Tenant['id'][]>((acc, row) => {
    if (role && !row.roles?.includes(role)) return acc
    if (!row.tenant) return acc
    acc.push(extractID(row.tenant))
    return acc
  }, [])
}
