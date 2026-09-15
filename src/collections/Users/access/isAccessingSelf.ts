import type { User } from '@/payload-types'

export const isAccessingSelf = ({ id, user }: { id?: number | string; user: User }) =>
  Boolean(id && user.id === id)
