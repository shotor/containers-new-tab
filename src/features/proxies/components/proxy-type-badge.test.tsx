import { describe, expect, it } from 'vitest'
import { ProxyTypeBadge } from '@/features/proxies/components/proxy-type-badge'
import { renderSnapshot } from '@/test/render-snapshot'

describe('ProxyTypeBadge', () => {
  it('labels socks as SOCKS5 and keeps socks4 distinct', () => {
    expect(renderSnapshot(<ProxyTypeBadge type="socks" />).textContent).toBe(
      'SOCKS5',
    )
    expect(renderSnapshot(<ProxyTypeBadge type="socks4" />).textContent).toBe(
      'SOCKS4',
    )
  })

  it('matches snapshot', () => {
    expect(renderSnapshot(<ProxyTypeBadge type="https" />)).toMatchSnapshot()
  })
})
