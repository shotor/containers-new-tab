import {
  listMacAssignmentsForContainer,
  type MacSiteAssignment,
} from '@/data/browser/browser-api'
import {
  type ProxyFormValues,
  proxyFormValuesFromStored,
} from '@/features/container-detail/container-detail.schema'
import type { ContainerIdentity } from '@/data/browser/types'
import { extensionStorageApi } from '@/data/extension/extension-storage-api'

/** Payload needed to paint the detail form for one container. */
export type ContainerDetailPayload = {
  identity: ContainerIdentity
  proxy: ProxyFormValues
  sites: MacSiteAssignment[]
}

type CacheEntry =
  | { data: ContainerDetailPayload; status: 'ready' }
  | { promise: Promise<ContainerDetailPayload | null>; status: 'pending' }

const cache = new Map<string, CacheEntry>()

/**
 * Fetch identity, MAC assignments, and proxy for a container.
 * @param cookieStoreId - Container store id to load.
 * @returns Detail payload, or null when the container is gone.
 */
export const loadContainerDetailPayload = async (
  cookieStoreId: string,
): Promise<ContainerDetailPayload | null> => {
  const found = (await extensionStorageApi.getContainers()).find(
    (container) => container.cookieStoreId === cookieStoreId,
  )

  if (!found) {
    return null
  }

  const [sites, storedProxy] = await Promise.all([
    listMacAssignmentsForContainer(found.cookieStoreId),
    extensionStorageApi.getProxyForContainer(found.cookieStoreId),
  ])

  return {
    identity: found,
    proxy: proxyFormValuesFromStored(storedProxy),
    sites,
  }
}

/**
 * Start loading detail data for a container (no-op if already cached/in flight).
 * @param cookieStoreId - Container store id to prefetch.
 */
export const prefetchContainerDetail = (cookieStoreId: string): void => {
  if (cache.has(cookieStoreId)) {
    return
  }

  const promise = loadContainerDetailPayload(cookieStoreId).then((data) => {
    if (data) {
      cache.set(cookieStoreId, { data, status: 'ready' })
    } else {
      cache.delete(cookieStoreId)
    }

    return data
  })

  cache.set(cookieStoreId, { promise, status: 'pending' })
}

/**
 * Read a fully resolved prefetch without removing it.
 * @param cookieStoreId - Container store id.
 * @returns Ready payload, or undefined when missing/still pending.
 */
export const peekReadyContainerDetail = (
  cookieStoreId: string,
): ContainerDetailPayload | undefined => {
  const entry = cache.get(cookieStoreId)

  if (entry?.status === 'ready') {
    return entry.data
  }

  return undefined
}

/**
 * Take a prefetch promise/result for the detail hook (removes the cache entry).
 * @param cookieStoreId - Container store id.
 * @returns Promise of the payload (or null), or undefined when nothing was prefetched.
 */
export const takePrefetchedContainerDetail = (
  cookieStoreId: string,
): Promise<ContainerDetailPayload | null> | undefined => {
  const entry = cache.get(cookieStoreId)

  if (!entry) {
    return undefined
  }

  cache.delete(cookieStoreId)

  if (entry.status === 'ready') {
    return Promise.resolve(entry.data)
  }

  return entry.promise
}

/**
 * Drop a cached/in-flight prefetch (e.g. after delete).
 * @param cookieStoreId - Container store id to forget.
 */
export const clearPrefetchedContainerDetail = (cookieStoreId: string): void => {
  cache.delete(cookieStoreId)
}
