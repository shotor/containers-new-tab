import { fuzzyScore } from '@/utils/search/fuzzy-score'

/** An item paired with its fuzzy match result. */
type ScoredItem<T> = {
  item: T
  name: string
  score: number
}

/**
 * Keep only entries whose fuzzy score matched.
 * @param entry - The scored entry to test.
 * @returns True when the entry has a real score.
 */
const keepMatches = <T>(entry: {
  item: T
  name: string
  score: number | null
}): entry is ScoredItem<T> => entry.score !== null

/**
 * Case-insensitive name comparison for tie-breaking.
 * @param a - First name.
 * @param b - Second name.
 * @returns Negative/0/positive sort order.
 */
const byName = (a: string, b: string): number =>
  a.localeCompare(b, undefined, { sensitivity: 'base' })

/**
 * Filter items by fuzzy match on `key`, best score first, then locale name.
 * @param items - The items to filter.
 * @param query - The fuzzy query; empty sorts alphabetically.
 * @param key - Extracts the matchable name from an item.
 * @returns The matching items, best first.
 */
export const fuzzyFilterSorted = <T>(
  items: T[],
  query: string,
  key: (item: T) => string,
): T[] => {
  const q = query.trim()

  if (!q) {
    return [...items].sort((a, b) => byName(key(a), key(b)))
  }

  return items
    .map((item) => {
      const name = key(item)
      return { item, name, score: fuzzyScore(name, q) }
    })
    .filter(keepMatches)
    .sort((a, b) => b.score - a.score || byName(a.name, b.name))
    .map((entry) => entry.item)
}
