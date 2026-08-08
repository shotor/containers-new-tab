import type { ExtensionStorageObject } from '@/data/types'
import { storeParseMap } from '@/data/extension/api/store-parse-map'

/**
 * Read and validate a single extension store field.
 * @param key - The storage key to read.
 * @returns The parsed value for that key.
 */
export const getItem = async <K extends keyof ExtensionStorageObject>(
  key: K,
): Promise<ExtensionStorageObject[K]> => {
  const raw = await browser.storage.local.get(key)
  return storeParseMap[key](raw[key])
}
