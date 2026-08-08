import { getItem } from '@/data/extension/api/get-item'
import { setStore } from '@/data/extension/api/set-store'

/**
 * Increment the open-count of a container (drives "most used").
 * @param cookieStoreId - The container's cookieStoreId.
 */
export const bumpUsage = async (cookieStoreId: string): Promise<void> => {
  const usageCounts = await getItem('usageCounts')
  usageCounts[cookieStoreId] = (usageCounts[cookieStoreId] ?? 0) + 1
  await setStore({ usageCounts })
}
