import { DEFAULT_STORE } from '@/data/types'

/**
 * Parse usage counts, dropping non-finite or negative entries.
 * @param value - Raw storage value.
 * @returns A sanitized usage map.
 */
export const parseUsageCounts = (value: unknown): Record<string, number> => {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return { ...DEFAULT_STORE.usageCounts }
  }

  const out: Record<string, number> = {}

  for (const [id, count] of Object.entries(value)) {
    if (typeof count === 'number' && Number.isFinite(count) && count >= 0) {
      out[id] = count
    }
  }

  return out
}
