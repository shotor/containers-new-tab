import { beforeEach, describe, expect, it, vi } from 'vitest'

import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'
import type { SavedProxy } from '@/data/types'

const proxy: SavedProxy = {
  doNotProxyLocal: true,
  host: 'proxy.example',
  name: 'Office',
  password: 'test-password',
  port: 8080,
  type: 'http',
  username: 'test-user',
}
let store: Record<string, unknown>

beforeEach(() => {
  store = {}

  let queue = Promise.resolve()

  vi.stubGlobal('navigator', {
    locks: {
      request: (_name: string, callback: () => Promise<unknown>) => {
        const next = queue.then(callback)
        queue = next.then(
          () => undefined,
          () => undefined,
        )
        return next
      },
    },
  })

  vi.stubGlobal('browser', {
    storage: {
      local: {
        get: async (key: string) => structuredClone({ [key]: store[key] }),
        set: async (patch: Record<string, unknown>) => {
          store = { ...store, ...structuredClone(patch) }
        },
      },
    },
  })
})

describe('proxyLibraryApi', () => {
  it('imports old proxies once, preserving credentials and assignments', async () => {
    const { name: _name, ...legacy } = proxy

    store.containerProxies = { work: legacy }

    const library = await proxyLibraryApi.get()
    const id = library.assignments.work

    expect(library.proxies[id]).toEqual({
      ...legacy,
      name: 'proxy.example:8080',
    })
    expect(await proxyLibraryApi.get()).toEqual(library)
    expect(store.containerProxies).toEqual({ work: legacy })
  })

  it('updates every assigned container and clears only the selected assignment', async () => {
    await proxyLibraryApi.save('office', proxy)
    await proxyLibraryApi.assign('work', 'office')
    await proxyLibraryApi.assign('personal', 'office')
    await proxyLibraryApi.save('office', { ...proxy, host: 'new.example' })

    expect(store.containerProxies).toMatchObject({
      personal: { host: 'new.example', password: 'test-password' },
      work: { host: 'new.example', password: 'test-password' },
    })

    await proxyLibraryApi.assign('work', '')

    expect(store.containerProxies).not.toHaveProperty('work')
    expect(store.containerProxies).toHaveProperty('personal')
  })

  it('deletes a proxy and all its assignments while preserving other proxies', async () => {
    await proxyLibraryApi.save('office', proxy)
    await proxyLibraryApi.save('other', { ...proxy, name: 'Other' })
    await proxyLibraryApi.assign('work', 'office')
    await proxyLibraryApi.assign('personal', 'office')
    await proxyLibraryApi.assign('unaffected', 'other')
    await proxyLibraryApi.remove('office')

    const library = await proxyLibraryApi.get()

    expect(library.proxies).not.toHaveProperty('office')
    expect(library.assignments).toEqual({ unaffected: 'other' })
    expect(Object.keys(store.containerProxies ?? {})).toEqual(['unaffected'])
    expect(library.proxies.other.name).toBe('Other')
  })

  it('rejects invalid definitions and missing selections without replacing settings', async () => {
    await proxyLibraryApi.save('office', proxy)

    const saved = structuredClone(store)

    await expect(
      proxyLibraryApi.save('bad', { ...proxy, port: 65536 }),
    ).rejects.toThrow('required')

    await expect(
      proxyLibraryApi.save('bad', { ...proxy, name: ' ' }),
    ).rejects.toThrow('required')

    await expect(proxyLibraryApi.assign('work', 'missing')).rejects.toThrow(
      'no longer exists',
    )

    expect(store).toEqual(saved)
  })

  it('serializes concurrent edits so neither definition is lost', async () => {
    await Promise.all([
      proxyLibraryApi.save('a', proxy),
      proxyLibraryApi.save('b', { ...proxy, name: 'Home' }),
    ])

    expect(Object.keys((await proxyLibraryApi.get()).proxies)).toEqual([
      'a',
      'b',
    ])
  })
})
