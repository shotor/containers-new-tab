import { type ContainerProxy, PROXY_TYPES, type ProxyType } from '@/data/types'

const isProxyType = (value: unknown): value is ProxyType =>
  typeof value === 'string' &&
  (PROXY_TYPES as readonly string[]).includes(value)

/**
 * Parse one container proxy config.
 * @param value - Raw storage value.
 * @returns A valid proxy, or null when the entry is unusable.
 */
export const parseContainerProxy = (value: unknown): ContainerProxy | null => {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const raw = value as Record<string, unknown>

  if (!isProxyType(raw.type) || raw.type === 'direct') {
    return null
  }

  if (typeof raw.host !== 'string') {
    return null
  }

  const host = raw.host.trim()

  if (!host) {
    return null
  }

  if (
    typeof raw.port !== 'number' ||
    !Number.isInteger(raw.port) ||
    raw.port < 1 ||
    raw.port > 65535
  ) {
    return null
  }

  if (raw.username !== undefined && typeof raw.username !== 'string') {
    return null
  }

  if (raw.password !== undefined && typeof raw.password !== 'string') {
    return null
  }

  const proxy: ContainerProxy = {
    doNotProxyLocal:
      typeof raw.doNotProxyLocal === 'boolean' ? raw.doNotProxyLocal : true,
    host,
    port: raw.port,
    type: raw.type,
  }

  const username = raw.username?.trim()
  const password = raw.password

  if (username) {
    proxy.username = username
  }

  if (typeof password === 'string' && password) {
    proxy.password = password
  }

  return proxy
}
