import {
  DEFAULT_STORE,
  SORT_DIRECTIONS,
  type SortDirection,
} from '@/data/types'

const isSortDirection = (value: unknown): value is SortDirection =>
  typeof value === 'string' &&
  (SORT_DIRECTIONS as readonly string[]).includes(value)

/**
 * Parse a stored sort direction, or fall back to the default.
 * @param value - Raw storage value.
 * @returns A valid sort direction.
 */
export const parseSortDirection = (value: unknown): SortDirection =>
  isSortDirection(value) ? value : DEFAULT_STORE.sortDirection
