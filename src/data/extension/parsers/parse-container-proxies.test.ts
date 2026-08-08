import { describe, expect, it } from 'vitest'
import { parseContainerProxies } from '@/data/extension/parsers/parse-container-proxies'

describe('parseContainerProxies', () => {
  it('keeps only valid entries', () => {
    expect(
      parseContainerProxies({
        bad: { host: 'h', port: -1, type: 'http' },
        good: { doNotProxyLocal: true, host: 'h', port: 443, type: 'https' },
      }),
    ).toEqual({
      good: { doNotProxyLocal: true, host: 'h', port: 443, type: 'https' },
    })
  })
})
