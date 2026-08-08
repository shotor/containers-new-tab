import { describe, expect, it } from 'vitest'
import { toProxyInfo } from '@/data/proxy/utils/to-proxy-info'

describe('toProxyInfo', () => {
  it('maps a stored proxy into browser.proxy shape', () => {
    expect(
      toProxyInfo({
        doNotProxyLocal: true,
        host: 'proxy.example',
        password: 'p',
        port: 8080,
        type: 'http',
        username: 'u',
      }),
    ).toEqual({
      host: 'proxy.example',
      password: 'p',
      port: 8080,
      type: 'http',
      username: 'u',
    })
  })

  it('maps direct type without changing other fields', () => {
    expect(
      toProxyInfo({
        doNotProxyLocal: true,
        host: '',
        port: 0,
        type: 'direct',
      }),
    ).toMatchObject({ type: 'direct' })
  })
})
