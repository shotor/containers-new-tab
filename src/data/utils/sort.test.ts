import { describe, expect, it } from 'vitest'
import { sortContainers } from '@/data/utils/sort'

const containers = [
  { cookieStoreId: 'b', name: 'Beta' },
  { cookieStoreId: 'a', name: 'Alpha' },
  { cookieStoreId: 'c', name: 'Charlie' },
]

describe('sortContainers', () => {
  it('sorts alphabetically', () => {
    expect(
      sortContainers({
        containers,
        customOrder: [],
        sortMode: 'alpha',
        usageCounts: {},
      }).map((c) => c.name),
    ).toEqual(['Alpha', 'Beta', 'Charlie'])
  })

  it('sorts by usage then name', () => {
    expect(
      sortContainers({
        containers,
        customOrder: [],
        sortMode: 'mostUsed',
        usageCounts: { a: 5, b: 1, c: 5 },
      }).map((c) => c.cookieStoreId),
    ).toEqual(['a', 'c', 'b'])
  })

  it('sorts by custom order with alpha fallback', () => {
    expect(
      sortContainers({
        containers,
        customOrder: ['c', 'a'],
        sortMode: 'custom',
        usageCounts: {},
      }).map((c) => c.cookieStoreId),
    ).toEqual(['c', 'a', 'b'])
  })
})
