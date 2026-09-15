import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

import { Config } from '@/payload-types'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { isSuperAdmin } from './access/isSuperAdmin'
import { getUserTenantIDs } from './utilities/getUserTenantIDs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tenants],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL as string],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL as string],
  plugins: [
    multiTenantPlugin<Config>({
      collections: {
        media: {},
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => isSuperAdmin(req.user) || getUserTenantIDs(req.user).length > 0,
        },
      },
      tenantsArrayField: { includeDefaultField: false }, // step 7 placed it manually
      debug: process.env.NODE_ENV === 'development',
    }),
  ],
})
