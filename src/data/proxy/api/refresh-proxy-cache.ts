import { getItem } from '@/data/extension/api/get-item'
import { proxyCache } from '@/data/proxy/proxy-cache'

/**
 * Reload the proxy cache from extension storage.
 */
export const refreshProxyCache = async (): Promise<void> => {
  proxyCache.current = { ...(await getItem('containerProxies')) }
}
