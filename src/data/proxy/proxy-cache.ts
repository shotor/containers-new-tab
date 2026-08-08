import type { ContainerProxy } from '@/data/types'

/** Mutable cache for the background proxy listener. */
export const proxyCache: { current: Record<string, ContainerProxy> } = {
  current: {},
}
