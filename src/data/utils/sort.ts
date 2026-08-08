import type { SortMode } from '@/data/types'

/** Minimal container shape needed for sorting. */
type SortableContainer = { cookieStoreId: string; name: string }

/** Everything sortContainers needs to order a container list. */
export type SortContainersArgs<T extends SortableContainer> = {
  containers: T[]
  sortMode: SortMode
  usageCounts: Record<string, number>
  customOrder: string[]
}

/**
 * Sort containers by the active mode without mutating the input.
 * @param args - The containers plus the sort mode and its data.
 * @returns A new sorted array.
 */
export const sortContainers = <T extends SortableContainer>(
  args: SortContainersArgs<T>,
): T[] => {
  const { containers, sortMode, usageCounts, customOrder } = args

  switch (sortMode) {
    case 'alpha':
      return [...containers].sort((a, b) => a.name.localeCompare(b.name))
    case 'custom': {
      const rank = new Map(customOrder.map((id, index) => [id, index]))
      return [...containers].sort(
        (a, b) =>
          (rank.get(a.cookieStoreId) ?? Number.MAX_SAFE_INTEGER) -
            (rank.get(b.cookieStoreId) ?? Number.MAX_SAFE_INTEGER) ||
          a.name.localeCompare(b.name),
      )
    }
    case 'mostUsed':
      return [...containers].sort(
        (a, b) =>
          (usageCounts[b.cookieStoreId] ?? 0) -
            (usageCounts[a.cookieStoreId] ?? 0) || a.name.localeCompare(b.name),
      )
  }
}
