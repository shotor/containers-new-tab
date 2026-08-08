import type { ContainerProxy } from '@/data/types'
import { getItem } from '@/data/extension/api/get-item'
import { setStore } from '@/data/extension/api/set-store'

/**
 * Store (or clear, for null/direct) the proxy config of a container.
 * @param cookieStoreId - The container's cookieStoreId.
 * @param proxy - The proxy config, or null/direct to clear.
 */
export const setProxyForContainer = async (
  cookieStoreId: string,
  proxy: ContainerProxy | null,
): Promise<void> => {
  const containerProxies = await getItem('containerProxies')

  if (!proxy || proxy.type === 'direct') {
    delete containerProxies[cookieStoreId]
  } else {
    containerProxies[cookieStoreId] = proxy
  }

  await setStore({ containerProxies })
}
