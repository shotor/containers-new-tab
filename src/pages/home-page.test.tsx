import { describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import { HomePage } from '@/pages/home-page'
import { render } from 'preact'
import { renderSnapshot } from '@/test/render-snapshot'
import { useState } from 'preact/hooks'

vi.mock('wouter', () => ({
  useLocation: () => useState('/'),
}))

vi.mock('@/pages/proxy-page', () => ({
  ProxyPage: () => <div data-mock="Proxies" />,
}))

vi.mock('@/features/container-grid/components/sort-menu', () => ({
  SortMenu: () => <div data-mock="SortMenu" />,
}))

vi.mock('@/features/proxies/components/proxy-sort-menu', () => ({
  ProxySortMenu: () => <div data-mock="ProxySortMenu" />,
}))

vi.mock('@/features/theme-menu/theme-menu', () => ({
  ThemeMenu: () => <div data-mock="ThemeMenu" />,
}))

vi.mock('@/features/container-grid/container-grid', () => ({
  ContainerGrid: () => <div data-mock="ContainerGrid" />,
}))

vi.mock('@/features/site-assignments/site-assignments', () => ({
  SiteAssignments: () => <div data-mock="SiteAssignments" />,
}))

describe('HomePage', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<HomePage />)).toMatchSnapshot()
  })

  it('switches between containers and proxies', () => {
    const root = document.createElement('div')

    try {
      act(() => {
        render(<HomePage />, root)
      })

      const tabs = root.querySelectorAll<HTMLButtonElement>('nav button')
      const grid = root.querySelector('[data-mock="ContainerGrid"]')!
      const proxyPage = root.querySelector('[data-mock="Proxies"]')!
      expect(grid).not.toBeNull()
      expect(proxyPage.closest('[hidden]')).not.toBeNull()

      act(() => tabs[1].click())

      expect(tabs[1].getAttribute('aria-current')).toBe('page')
      expect(root.querySelector('[data-mock="Proxies"]')).toBe(proxyPage)
      expect(proxyPage.closest('[hidden]')).toBeNull()
      expect(grid.closest('[hidden]')).not.toBeNull()
      expect(
        root.querySelector('[data-mock="SortMenu"]')?.closest('[hidden]'),
      ).not.toBeNull()

      act(() => tabs[0].click())

      expect(tabs[0].getAttribute('aria-current')).toBe('page')
      expect(root.querySelector('[data-mock="ContainerGrid"]')).toBe(grid)
      expect(grid.closest('[hidden]')).toBeNull()
      expect(root.querySelector('[data-mock="Proxies"]')).toBe(proxyPage)
      expect(proxyPage.closest('[hidden]')).not.toBeNull()

      act(() => tabs[1].click())

      expect(root.querySelector('[data-mock="Proxies"]')).toBe(proxyPage)
      expect(proxyPage.closest('[hidden]')).toBeNull()
    } finally {
      act(() => render(null, root))
    }
  })
})
