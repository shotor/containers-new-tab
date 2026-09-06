import { describe, expect, it } from 'vitest'

import { ProxyFields } from '@/features/proxies/components/proxy-fields'

import { renderSnapshot } from '@/test/render-snapshot'

describe('ProxyFields', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <ProxyFields
          value={{
            doNotProxyLocal: true,
            host: '',
            name: '',
            port: 0,
            type: 'http',
          }}
          onChange={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })
})
