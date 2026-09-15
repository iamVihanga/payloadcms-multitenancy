import type { CollectionConfig } from 'payload'
import { isSuperAdmin, isSuperAdminAccess } from '@/access/isSuperAdmin'
import { tenantAdminUpdate } from './access/tenantAdminUpdate'
import { validateSubdomain } from './hooks/validateSubdomain'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    group: 'Platform',
    defaultColumns: ['name', 'slug', 'status'],
  },
  access: {
    read: () => true,
    create: isSuperAdminAccess,
    update: tenantAdminUpdate,
    delete: isSuperAdminAccess,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Becomes {slug}.marketplace.com' },
      hooks: {
        beforeValidate: [validateSubdomain],
      },
    },
    {
      name: 'customDomain',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Optional. Set by the platform only.' },
      access: { update: ({ req }) => isSuperAdmin(req.user) },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: ['pending', 'active', 'suspended'],
      admin: { position: 'sidebar' },
      access: { update: ({ req }) => isSuperAdmin(req.user) },
    },
    {
      name: 'plan',
      type: 'select',
      defaultValue: 'free',
      options: ['free', 'pro'],
      admin: { position: 'sidebar' },
      access: {
        read: ({ req }) => Boolean(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      type: 'group',
      name: 'brand',
      fields: [
        { name: 'tagline', type: 'text' },
        { name: 'accent', type: 'text', defaultValue: '#15596b' },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      fields: [
        { name: 'whatsapp', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'city', type: 'text' },
      ],
    },
  ],
}
