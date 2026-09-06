import { describe, expect, it } from 'vitest'
import { identityPersistSchema } from '@/features/container-detail/container-detail.schema'

describe('identityPersistSchema', () => {
  it('requires a trimmed name', () => {
    expect(
      identityPersistSchema.safeParse({
        color: 'blue',
        icon: 'briefcase',
        name: '  ',
      }).success,
    ).toBe(false)

    expect(
      identityPersistSchema.parse({
        color: 'blue',
        icon: 'briefcase',
        name: ' Work ',
      }),
    ).toEqual({ color: 'blue', icon: 'briefcase', name: 'Work' })
  })
})
