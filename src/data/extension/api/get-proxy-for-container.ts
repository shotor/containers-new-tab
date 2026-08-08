import type { ContainerProxy } from '@/data/types'
import { getItem } from '@/data/extension/api/get-item'

/**
 * Read the stored proxy config for a container.
 * @param cookieStoreId - The container's cookieStoreId.
 * @returns The proxy config, or null when unset/direct.
 */
export const getProxyForContainer = async (
  cookieStoreId: string,
): Promise<ContainerProxy | null> => {
  const containerProxies = await getItem('containerProxies')
  const proxy = containerProxies[cookieStoreId]

  if (!proxy || proxy.type === 'direct') {
    return null
  }

  return proxy
}
