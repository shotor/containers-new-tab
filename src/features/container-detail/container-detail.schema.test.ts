import { describe, expect, it } from 'vitest'
import {
  identityPersistSchema,
  proxyFormValuesFromStored,
  proxyPersistSchema,
} from '@/features/container-detail/container-detail.schema'

describe('identityPersistSchema', () => {
  it('requires a trimmed name', () => {
    expect(
      identityPersistSchema.safeParse({
        color: 'blue',
        icon: 'briefcase',
        name: '  ',
      }).success,
    ).toBe(false)
    expect(
      identityPersistSchema.parse({
        color: 'blue',
        icon: 'briefcase',
        name: ' Work ',
      }),
    ).toEqual({ color: 'blue', icon: 'briefcase', name: 'Work' })
  })
})

describe('proxyPersistSchema', () => {
  it('transforms direct to null', () => {
    expect(
      proxyPersistSchema.parse({
        doNotProxyLocal: true,
        host: '',
        password: '',
        port: '',
        type: 'direct',
        username: '',
      }),
    ).toBeNull()
  })

  it('parses a complete http proxy', () => {
    expect(
      proxyPersistSchema.parse({
        doNotProxyLocal: false,
        host: ' proxy.example ',
        password: 'secret',
        port: '8080',
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

  it('rejects invalid ports', () => {
    expect(
      proxyPersistSchema.safeParse({
        doNotProxyLocal: true,
        host: 'h',
        password: '',
        port: '80',
        type: 'http',
        username: '',
      }).success,
    ).toBe(false)
  })
})

describe('proxyFormValuesFromStored', () => {
  it('defaults when empty and maps stored proxies', () => {
    expect(proxyFormValuesFromStored(null)).toEqual({
      doNotProxyLocal: true,
      host: '',
      password: '',
      port: '',
      type: 'direct',
      username: '',
    })
    expect(
      proxyFormValuesFromStored({
        doNotProxyLocal: false,
        host: 'h',
        password: 'p',
        port: 1080,
        type: 'socks',
        username: 'u',
      }),
    ).toEqual({
      doNotProxyLocal: false,
      host: 'h',
      password: 'p',
      port: '1080',
      type: 'socks',
      username: 'u',
    })
  })
})
