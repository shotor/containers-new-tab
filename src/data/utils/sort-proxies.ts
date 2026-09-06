import type { ProxySortMode, SavedProxy, SortDirection } from '@/data/types'

/** A saved proxy with its id and how many containers use it. */
export type ProxyEntry = { id: string; proxy: SavedProxy; usage: number }

/**
 * Sort proxy entries by the active mode without mutating the input.
 * Natural order: name/type A→Z, port low→high, containers most→fewest;
 * ties fall back to name.
 * @param entries - Unsorted proxy entries.
 * @param sortMode - Field to sort by.
 * @param sortDirection - `desc` reverses the natural order.
 * @returns A new sorted array.
 */
export const sortProxies = (
  entries: ProxyEntry[],
  sortMode: ProxySortMode,
  sortDirection: SortDirection = 'asc',
): ProxyEntry[] => {
  const direction = sortDirection === 'desc' ? -1 : 1
  const byName = (a: ProxyEntry, b: ProxyEntry) =>
    a.proxy.name.localeCompare(b.proxy.name)

  const compare = (a: ProxyEntry, b: ProxyEntry): number => {
    switch (sortMode) {
      case 'name':
        return byName(a, b)
      case 'type':
        return a.proxy.type.localeCompare(b.proxy.type) || byName(a, b)
      case 'port':
        return a.proxy.port - b.proxy.port || byName(a, b)
      case 'containers':
        return b.usage - a.usage || byName(a, b)
    }
  }

  return [...entries].sort((a, b) => direction * compare(a, b))
}
