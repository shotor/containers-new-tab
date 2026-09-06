import { describe, expect, it } from 'vitest'
import { sortContainers, toggleSortSelection } from '@/data/utils/sort'

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

  it('reverses alpha and usage order when descending', () => {
    expect(
      sortContainers({
        containers,
        customOrder: [],
        sortDirection: 'desc',
        sortMode: 'alpha',
        usageCounts: {},
      }).map((c) => c.name),
    ).toEqual(['Charlie', 'Beta', 'Alpha'])
    expect(
      sortContainers({
        containers,
        customOrder: [],
        sortDirection: 'desc',
        sortMode: 'mostUsed',
        usageCounts: { a: 5, b: 1, c: 5 },
      }).map((c) => c.cookieStoreId),
    ).toEqual(['b', 'c', 'a'])
  })

  it('ignores direction for custom order', () => {
    expect(
      sortContainers({
        containers,
        customOrder: ['c', 'a'],
        sortDirection: 'desc',
        sortMode: 'custom',
        usageCounts: {},
      }).map((c) => c.cookieStoreId),
    ).toEqual(['c', 'a', 'b'])
  })

  it('toggles direction on re-selection and resets on mode change', () => {
    const asc = { direction: 'asc', mode: 'alpha' } as const
    expect(toggleSortSelection(asc, 'alpha')).toEqual({
      direction: 'desc',
      mode: 'alpha',
    })
    expect(toggleSortSelection({ ...asc, direction: 'desc' }, 'alpha')).toEqual(
      asc,
    )
    expect(
      toggleSortSelection({ ...asc, direction: 'desc' }, 'mostUsed'),
    ).toEqual({ direction: 'asc', mode: 'mostUsed' })
    expect(
      toggleSortSelection({ direction: 'asc', mode: 'custom' }, 'custom', [
        'custom',
      ]),
    ).toEqual({ direction: 'asc', mode: 'custom' })
  })
})
