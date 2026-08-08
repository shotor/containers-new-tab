import { describe, expect, it, vi } from 'vitest'
import { ContainerGrid } from '@/features/container-grid/container-grid'
import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn<() => void>()],
}))

vi.mock('@/features/container-grid/hooks/use-sorted-containers', () => ({
  useSortedContainers: () => ({
    containers: [
      {
        color: 'blue',
        colorCode: '#0000ff',
        cookieStoreId: 'firefox-container-1',
        icon: 'briefcase',
        name: 'Work',
      },
    ],
    setCustomOrder: vi.fn<() => void>(),
    sortMode: 'alpha',
  }),
}))

vi.mock('@/features/container-grid/hooks/use-current-store-id', () => ({
  useCurrentStoreId: () => 'firefox-default',
}))

vi.mock('@/utils/browser/open-container-tab', () => ({
  openContainerTab: vi.fn<() => void>(),
}))

vi.mock('@/features/container-grid/components/tile-grid', () => ({
  TileGrid: (props: Record<string, unknown>) => (
    <div
      data-mock="TileGrid"
      data-sortable={String(props.sortableEnabled)}
      data-current={String(props.currentStoreId)}
    />
  ),
}))

describe('ContainerGrid', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<ContainerGrid />)).toMatchSnapshot()
  })
})
