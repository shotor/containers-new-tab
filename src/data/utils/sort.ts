import type { SortDirection, SortMode } from '@/data/types'

/** Minimal container shape needed for sorting. */
type SortableContainer = { cookieStoreId: string; name: string }

/** Everything sortContainers needs to order a container list. */
export type SortContainersArgs<T extends SortableContainer> = {
  containers: T[]
  sortMode: SortMode
  /** Reverses alpha/mostUsed when `desc`; custom order is never reversed. */
  sortDirection?: SortDirection
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
  const { containers, sortMode, sortDirection, usageCounts, customOrder } = args
  const direction = sortDirection === 'desc' ? -1 : 1

  switch (sortMode) {
    case 'alpha':
      return [...containers].sort(
        (a, b) => direction * a.name.localeCompare(b.name),
      )
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
          direction *
          ((usageCounts[b.cookieStoreId] ?? 0) -
            (usageCounts[a.cookieStoreId] ?? 0) ||
            a.name.localeCompare(b.name)),
      )
  }
}

/** A sort mode plus its direction. */
export type SortSelection<T extends string> = {
  mode: T
  direction: SortDirection
}

/**
 * Apply a menu pick: re-selecting the active mode flips its direction,
 * anything else starts ascending.
 * @param current - The active mode and direction.
 * @param mode - The picked mode.
 * @param fixed - Modes that never reverse (e.g. custom order).
 * @returns The next selection.
 */
export const toggleSortSelection = <T extends string>(
  current: SortSelection<T>,
  mode: T,
  fixed: readonly T[] = [],
): SortSelection<T> => {
  const toggling = mode === current.mode && !fixed.includes(mode)

  return {
    direction: toggling && current.direction !== 'desc' ? 'desc' : 'asc',
    mode,
  }
}
