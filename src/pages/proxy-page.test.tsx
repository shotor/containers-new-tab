import { render } from 'preact'
import { act } from 'preact/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ProxyPage } from '@/pages/proxy-page'

import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/features/proxies/hooks/use-proxy-containers', () => ({
  useProxyContainers: () => ({ containers: [], error: '', loading: false }),
}))

vi.mock('@/features/proxies/hooks/use-proxy-sort', () => ({
  useProxySort: () => ({
    setSortMode: vi.fn(),
    sortDirection: 'asc',
    sortMode: 'name',
  }),
}))

vi.mock('@/features/proxies/hooks/use-proxy-library', () => ({
  useProxyLibrary: () => ({
    error: '',
    library: { assignments: {}, proxies: {} },
    loading: false,
  }),
}))

describe('ProxyPage', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<ProxyPage />)).toMatchSnapshot()
  })

  it('replaces the empty state with the new proxy form', () => {
    const root = renderSnapshot(<ProxyPage />)
    expect(root.textContent).toContain('No proxies yet')
    act(() => root.querySelector('button')!.click())
    expect(root.textContent).not.toContain('No proxies yet')
    expect(root.querySelector('form')).not.toBeNull()
  })

  it('discards the new proxy form when the page becomes inactive', () => {
    const root = renderSnapshot(<ProxyPage active />)
    act(() => root.querySelector('button')!.click())
    expect(root.querySelector('form')).not.toBeNull()
    act(() => {
      render(<ProxyPage active={false} />, root)
    })
    expect(root.querySelector('form')).toBeNull()
    expect(root.textContent).toContain('No proxies yet')
  })
})
