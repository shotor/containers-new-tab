import { describe, expect, it } from 'vitest'
import { parseContainerProxy } from '@/data/extension/parsers/parse-container-proxy'

describe('parseContainerProxy', () => {
  it('parses a valid proxy', () => {
    expect(
      parseContainerProxy({
        doNotProxyLocal: false,
        host: ' proxy.example ',
        password: 'secret',
        port: 8080,
        type: 'http',
        username: ' u ',
      }),
    ).toEqual({
      doNotProxyLocal: false,
      host: 'proxy.example',
      password: 'secret',
      port: 8080,
      type: 'http',
      username: 'u',
    })
  })

  it('defaults doNotProxyLocal when missing', () => {
    expect(
      parseContainerProxy({
        host: '127.0.0.1',
        port: 1080,
        type: 'socks',
      }),
    ).toMatchObject({ doNotProxyLocal: true })
  })

  it('rejects invalid proxies', () => {
    expect(parseContainerProxy(null)).toBeNull()

    expect(
      parseContainerProxy({ host: 'x', port: 1, type: 'direct' }),
    ).toBeNull()

    expect(parseContainerProxy({ host: '', port: 80, type: 'http' })).toBeNull()

    expect(parseContainerProxy({ host: 'x', port: 0, type: 'http' })).toBeNull()

    expect(
      parseContainerProxy({ host: 'x', port: 80.5, type: 'http' }),
    ).toBeNull()

    expect(
      parseContainerProxy({
        host: 'x',
        port: 80,
        type: 'http',
        username: 1,
      }),
    ).toBeNull()
  })
})
