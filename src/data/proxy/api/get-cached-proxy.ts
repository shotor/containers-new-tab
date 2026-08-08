import type { ContainerProxy } from '@/data/types'
import { proxyCache } from '@/data/proxy/proxy-cache'

/**
 * Look up the cached proxy for a cookieStoreId.
 * @param cookieStoreId - The container's cookieStoreId.
 * @returns The cached proxy, or null when unknown/direct.
 */
export const getCachedProxy = (
  cookieStoreId: string | undefined,
): ContainerProxy | null => {
  if (!cookieStoreId) {
    return null
  }

  const proxy = proxyCache.current[cookieStoreId]

  if (!proxy || proxy.type === 'direct') {
    return null
  }

  return proxy
}
