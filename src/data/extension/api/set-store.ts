import type { ExtensionStorageObject } from '@/data/types'

/**
 * Merge a partial patch into the extension store.
 * @param patch - The keys to write.
 */
export const setStore = async (
  patch: Partial<ExtensionStorageObject>,
): Promise<void> => {
  await browser.storage.local.set(patch)
}
