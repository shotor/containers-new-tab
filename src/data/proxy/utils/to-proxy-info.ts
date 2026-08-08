import type { ContainerProxy } from '@/data/types'

/** Proxy shape consumed by browser.proxy.onRequest. */
type ProxyInfo = {
  type: string
  host?: string
  port?: number
  username?: string
  password?: string
}

/**
 * Convert a stored container proxy to the browser.proxy request shape.
 * @param proxy - The stored proxy config.
 * @returns The ProxyInfo for the proxy listener.
 */
export const toProxyInfo = (proxy: ContainerProxy): ProxyInfo => ({
  host: proxy.host,
  password: proxy.password,
  port: proxy.port,
  type: proxy.type === 'direct' ? 'direct' : proxy.type,
  username: proxy.username,
})
