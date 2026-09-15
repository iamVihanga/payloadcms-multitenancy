import { getPayload } from 'payload'
import config from '@payload-config'

const SUPER_ADMIN_EMAIL = 'admin@codeville.com' // the account you created in step 4

const bootstrap = async () => {
  const payload = await getPayload({ config })

  // 1. promote yourself - overrideAccess skips the field-level rule
  const { docs: existing } = await payload.find({
    collection: 'users',
    where: { email: { equals: SUPER_ADMIN_EMAIL } },
    limit: 1,
  })

  if (!existing[0]) throw new Error(`No user found for ${SUPER_ADMIN_EMAIL}`)

  await payload.update({
    collection: 'users',
    id: existing[0].id,
    data: { roles: ['super-admin'] },
    overrideAccess: true,
  })

  // 2. two businesses
  const [villa, haputale] = await Promise.all([
    payload.create({
      collection: 'tenants',
      data: { name: 'Villa Lanka', slug: 'villa-lanka', status: 'active' },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'tenants',
      data: { name: 'Haputale Stays', slug: 'haputale-stays', status: 'active' },
      overrideAccess: true,
    }),
  ])

  // 3. one owner each
  await payload.create({
    collection: 'users',
    data: {
      email: 'owner@villalanka.test',
      password: 'test1234',
      name: 'Villa Lanka Owner',
      roles: ['user'],
      tenants: [{ tenant: villa.id, roles: ['tenant-admin'] }],
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'owner@haputale.test',
      password: 'test1234',
      name: 'Haputale Owner',
      roles: ['user'],
      tenants: [{ tenant: haputale.id, roles: ['tenant-admin'] }],
    },
    overrideAccess: true,
  })

  console.log('Bootstrapped. Super admin:', SUPER_ADMIN_EMAIL)
  process.exit(0)
}

await bootstrap()
