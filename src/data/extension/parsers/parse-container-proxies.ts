import { type ContainerProxy, DEFAULT_STORE } from '@/data/types'
import { parseContainerProxy } from '@/data/extension/parsers/parse-container-proxy'

/**
 * Parse the container proxy map, dropping invalid entries.
 * @param value - Raw storage value.
 * @returns A sanitized proxy map.
 */
export const parseContainerProxies = (
  value: unknown,
): Record<string, ContainerProxy> => {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return { ...DEFAULT_STORE.containerProxies }
  }

  const out: Record<string, ContainerProxy> = {}

  for (const [id, raw] of Object.entries(value)) {
    if (!id) {
      continue
    }

    const proxy = parseContainerProxy(raw)

    if (proxy) {
      out[id] = proxy
    }
  }

  return out
}
