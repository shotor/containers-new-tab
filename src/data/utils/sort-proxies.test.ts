import { describe, expect, it } from 'vitest'

import { type ProxyEntry, sortProxies } from '@/data/utils/sort-proxies'

const entry = (
  id: string,
  name: string,
  type: ProxyEntry['proxy']['type'],
  port: number,
  usage: number,
): ProxyEntry => ({
  id,
  proxy: { doNotProxyLocal: true, host: `${id}.example`, name, port, type },
  usage,
})

const entries = [
  entry('b', 'Beta', 'socks', 1080, 2),
  entry('a', 'Alpha', 'http', 8080, 0),
  entry('c', 'Charlie', 'http', 3128, 2),
]

const ids = (sorted: ProxyEntry[]) => sorted.map((e) => e.id)

describe('sortProxies', () => {
  it('sorts by name', () => {
    expect(ids(sortProxies(entries, 'name'))).toEqual(['a', 'b', 'c'])
  })

  it('sorts by type then name', () => {
    expect(ids(sortProxies(entries, 'type'))).toEqual(['a', 'c', 'b'])
  })

  it('sorts by port ascending', () => {
    expect(ids(sortProxies(entries, 'port'))).toEqual(['b', 'c', 'a'])
  })

  it('sorts by container count, most first, then name', () => {
    expect(ids(sortProxies(entries, 'containers'))).toEqual(['b', 'c', 'a'])
  })

  it('reverses when descending and leaves the input untouched', () => {
    expect(ids(sortProxies(entries, 'name', 'desc'))).toEqual(['c', 'b', 'a'])
    expect(ids(sortProxies(entries, 'containers', 'desc'))).toEqual([
      'a',
      'c',
      'b',
    ])
    expect(ids(entries)).toEqual(['b', 'a', 'c'])
  })
})
