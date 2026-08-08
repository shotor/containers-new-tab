import type { ContainerProxy } from '@/data/types'

/** Hosts that bypass the proxy when doNotProxyLocal is set. */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/**
 * Whether a request URL should bypass the proxy (local addresses).
 * @param proxy - The container's proxy config.
 * @param requestUrl - The URL being requested.
 * @returns True when the request should go direct.
 */
export const shouldSkipLocal = (
  proxy: ContainerProxy,
  requestUrl: string,
): boolean => {
  if (!proxy.doNotProxyLocal) {
    return false
  }

  try {
    const host = new URL(requestUrl).hostname.toLowerCase()
    return LOCAL_HOSTS.has(host) || host.endsWith('.localhost')
  } catch {
    return false
  }
}
