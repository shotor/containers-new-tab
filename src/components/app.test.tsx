import { describe, expect, it, vi } from 'vitest'
import type { ComponentChildren } from 'preact'

import { App } from '@/components/app'
import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/theme', () => ({
  ThemeProvider: ({ children }: { children?: ComponentChildren }) => (
    <div data-mock="ThemeProvider">{children}</div>
  ),
}))

vi.mock('@/pages/home-page', () => ({
  HomePage: () => <div data-mock="HomePage" />,
}))

vi.mock('@/pages/detail-page', () => ({
  DetailPage: ({ cookieStoreId }: { cookieStoreId?: string }) => (
    <div data-mock="DetailPage" data-id={cookieStoreId ?? 'new'} />
  ),
}))

vi.mock('wouter', () => ({
  Router: ({ children }: { children?: ComponentChildren }) => (
    <div data-mock="Router">{children}</div>
  ),
  useLocation: () => ['/', () => undefined],
}))

vi.mock('wouter/use-hash-location', () => ({
  useHashLocation: () => ['/', () => undefined],
}))

describe('App', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<App />)).toMatchSnapshot()
  })
})
