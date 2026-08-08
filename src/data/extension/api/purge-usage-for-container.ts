import { getItem } from '@/data/extension/api/get-item'
import { setStore } from '@/data/extension/api/set-store'

/**
 * Drop usage count and custom-order entries of a deleted container.
 * @param cookieStoreId - The container's cookieStoreId.
 */
export const purgeUsageForContainer = async (
  cookieStoreId: string,
): Promise<void> => {
  const [usageCounts, customOrder] = await Promise.all([
    getItem('usageCounts'),
    getItem('customOrder'),
  ])
  delete usageCounts[cookieStoreId]
  await setStore({
    customOrder: customOrder.filter((id) => id !== cookieStoreId),
    usageCounts,
  })
}
