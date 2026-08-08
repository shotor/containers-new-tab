import { DEFAULT_STORE, SORT_MODES, type SortMode } from '@/data/types'

const isSortMode = (value: unknown): value is SortMode =>
  typeof value === 'string' && (SORT_MODES as readonly string[]).includes(value)

/**
 * Parse a stored sort mode, or fall back to the default.
 * @param value - Raw storage value.
 * @returns A valid sort mode.
 */
export const parseSortMode = (value: unknown): SortMode =>
  isSortMode(value) ? value : DEFAULT_STORE.sortMode
