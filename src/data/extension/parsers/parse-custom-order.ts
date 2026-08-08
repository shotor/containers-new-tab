import { DEFAULT_STORE } from '@/data/types'

/**
 * Parse a custom container order, keeping only non-empty strings.
 * @param value - Raw storage value.
 * @returns A sanitized cookieStoreId list.
 */
export const parseCustomOrder = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [...DEFAULT_STORE.customOrder]
  }

  return value.filter(
    (id): id is string => typeof id === 'string' && id.length > 0,
  )
}
