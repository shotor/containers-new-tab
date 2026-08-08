import { getCachedProxy } from '@/data/proxy/api/get-cached-proxy'
import { refreshProxyCache } from '@/data/proxy/api/refresh-proxy-cache'

/** Proxy-cache helpers for the background listener. */
export const proxyApi = {
  getCachedProxy,
  refreshProxyCache,
}
