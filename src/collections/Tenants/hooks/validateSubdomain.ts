import type { FieldHook } from 'payload'
import { ValidationError } from 'payload'
import { RESERVED_SUBDOMAINS, SUBDOMAIN_SHAPE } from '@/lib/reserved'

export const validateSubdomain: FieldHook = ({ value }) => {
  const slug = String(value ?? '')
    .toLowerCase()
    .trim()

  if (!SUBDOMAIN_SHAPE.test(slug)) {
    throw new ValidationError({
      errors: [
        {
          path: 'slug',
          message:
            'Use 3-32 lowercase letters, numbers or dashes, starting and ending with a letter or number.',
        },
      ],
    })
  }

  if (RESERVED_SUBDOMAINS.has(slug)) {
    throw new ValidationError({
      errors: [{ path: 'slug', message: `"${slug}" is reserved and cannot be used.` }],
    })
  }

  return slug
}
