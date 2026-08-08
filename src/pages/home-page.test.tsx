import { describe, expect, it, vi } from 'vitest'
import { HomePage } from '@/pages/home-page'
import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/features/container-grid/components/sort-menu', () => ({
  SortMenu: () => <div data-mock="SortMenu" />,
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
})
