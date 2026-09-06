import * as z from 'zod/mini'

import { DEFAULT_STORE, type Shortcut } from '@/data/types'

const shortcutSchema = z.object({
  cookieStoreId: z.string(),
  id: z.string(),
  url: z.string(),
})

/**
 * Parse stored shortcuts, dropping malformed entries.
 * @param value - Raw storage value.
 * @returns Valid shortcuts (empty when the value is not a list).
 */
export const parseShortcuts = (value: unknown): Shortcut[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_STORE.shortcuts
  }

  return value.flatMap((item) => {
    const parsed = shortcutSchema.safeParse(item)
    return parsed.success ? [parsed.data] : []
  })
}
