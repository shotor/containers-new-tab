import * as z from 'zod/mini'

import { getItem } from '@/data/extension/api/get-item'
import { parseContainerProxy } from '@/data/extension/parsers/parse-container-proxy'
import type { ContainerProxy, ProxyLibrary, SavedProxy } from '@/data/types'

const librarySchema = z.object({
  assignments: z.record(z.string(), z.string()),
  proxies: z.record(z.string(), z.unknown()),
})

/**
 * Read saved definitions, importing older per-container settings on first use.
 * Must run under the proxy-library lock.
 * @returns Validated definitions and container assignments.
 */
const readLibrary = async (): Promise<ProxyLibrary> => {
  const raw = await browser.storage.local.get('proxyLibrary')

  if (raw.proxyLibrary !== undefined) {
    const parsed = librarySchema.parse(raw.proxyLibrary)
    const proxies: Record<string, SavedProxy> = {}

    Object.entries(parsed.proxies).forEach(([id, value]) => {
      const proxy = parseContainerProxy(value)
      const named = z.object({ name: z.string() }).safeParse(value)

      if (!proxy || !named.success) {
        throw new Error('A saved proxy is invalid. No settings were changed.')
      }

      proxies[id] = { ...proxy, name: named.data.name }
    })
    return { assignments: parsed.assignments, proxies }
  }

  const legacy = await getItem('containerProxies')
  const library: ProxyLibrary = { assignments: {}, proxies: {} }

  Object.entries(legacy).forEach(([container, proxy]) => {
    const id = `imported-${container}`
    library.proxies[id] = { ...proxy, name: `${proxy.host}:${proxy.port}` }
    library.assignments[container] = id
  })

  await browser.storage.local.set({ proxyLibrary: library })
  return library
}

/**
 * Persist definitions and the resolved runtime cache together.
 * @param library - Updated definitions and assignments.
 */
const persistLibrary = async (library: ProxyLibrary): Promise<void> => {
  const containerProxies: Record<string, ContainerProxy> = {}

  Object.entries(library.assignments).forEach(([container, id]) => {
    const saved = library.proxies[id]

    if (saved) {
      const { name: _name, ...proxy } = saved
      containerProxies[container] = proxy
    }
  })

  await browser.storage.local.set({ containerProxies, proxyLibrary: library })
}

/**
 * Read definitions with cross-tab migration serialization.
 * @returns The saved proxy library.
 */
const get = (): Promise<ProxyLibrary> =>
  navigator.locks.request('proxy-library', readLibrary)

/**
 * Create or update a shared proxy and every container using it.
 * @param id - Stable definition identifier.
 * @param proxy - Named proxy configuration.
 * @returns Completion of the saved update.
 */
const save = (id: string, proxy: SavedProxy): Promise<void> =>
  navigator.locks.request('proxy-library', async () => {
    const valid = parseContainerProxy(proxy)

    if (!valid || !proxy.name.trim()) {
      throw new Error('A name, host and valid port are required.')
    }

    const library = await readLibrary()
    library.proxies[id] = { ...valid, name: proxy.name.trim() }

    await persistLibrary(library)
  })

/**
 * Delete a proxy and clear every assignment to it in the same storage update.
 * @param id - Definition identifier.
 * @returns Completion of deletion.
 */
const remove = (id: string): Promise<void> =>
  navigator.locks.request('proxy-library', async () => {
    const library = await readLibrary()

    library.assignments = Object.fromEntries(
      Object.entries(library.assignments).filter(
        ([, assigned]) => assigned !== id,
      ),
    )

    delete library.proxies[id]
    await persistLibrary(library)
  })

/**
 * Select a shared definition, or direct access, for a container.
 * @param container - Container identifier.
 * @param id - Definition identifier; empty means direct access.
 * @returns Completion of the assignment update.
 */
const assign = (container: string, id: string): Promise<void> =>
  navigator.locks.request('proxy-library', async () => {
    const library = await readLibrary()

    if (id && !library.proxies[id]) {
      throw new Error('This proxy no longer exists.')
    }

    if (id) {
      library.assignments[container] = id
    } else {
      delete library.assignments[container]
    }

    await persistLibrary(library)
  })

/** Shared proxy definitions and their container assignments. */
export const proxyLibraryApi = { assign, get, remove, save }
