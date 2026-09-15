import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { createAccess } from './access/create'
import { readAccess } from './access/read'
import { updateAndDeleteAccess } from './access/updateAndDelete'

const membership = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['tenant-viewer'],
      options: ['tenant-admin', 'tenant-viewer'],
    },
  ],
})

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
    cookies: {
      domain: process.env.COOKIE_DOMAIN || undefined,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: { useAsTitle: 'email', group: 'Platform' },
  access: {
    create: createAccess,
    read: readAccess,
    update: updateAndDeleteAccess,
    delete: updateAndDeleteAccess,
    admin: ({ req }) => Boolean(req.user), // customers live in another collection
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: ['super-admin', 'user'],
      admin: { position: 'sidebar' },
      access: { update: ({ req }) => isSuperAdmin(req.user) },
    },
    { ...membership, admin: { ...(membership.admin || {}), position: 'sidebar' } },
  ],
}
