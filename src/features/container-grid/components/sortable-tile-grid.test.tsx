import { describe, expect, it, vi } from 'vitest'
import type { ComponentChildren } from 'preact'
import { renderSnapshot } from '@/test/render-snapshot'
import { SortableTileGrid } from '@/features/container-grid/components/sortable-tile-grid'

vi.mock('@dnd-kit/core', () => ({
  closestCenter: () => null,
  DndContext: ({ children }: { children?: ComponentChildren }) => (
    <div data-mock="DndContext">{children}</div>
  ),
}))

vi.mock('@dnd-kit/sortable', () => ({
  rectSortingStrategy: {},
  SortableContext: ({ children }: { children?: ComponentChildren }) => (
    <div data-mock="SortableContext">{children}</div>
  ),
  useSortable: () => ({
    attributes: {},
    isDragging: false,
    listeners: undefined,
    setNodeRef: () => undefined,
    transform: null,
    transition: undefined,
  }),
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => undefined,
    },
  },
}))

vi.mock('@/features/container-grid/hooks/use-tile-grid', () => ({
  useTileGrid: () => ({
    isSortingDrag: false,
    onDragCancel: () => undefined,
    onDragEnd: () => undefined,
    onDragStart: () => undefined,
    sensors: [],
    sortableIds: ['firefox-container-1'],
  }),
}))

describe('SortableTileGrid', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <SortableTileGrid
          identities={[
            {
              color: 'blue',
              colorCode: '#00f',
              cookieStoreId: 'firefox-container-1',
              icon: 'briefcase',
              iconUrl: 'icon:briefcase',
              name: 'Work',
            },
          ]}
          sortableEnabled
          currentStoreId="firefox-default"
          onOpen={() => undefined}
          onEdit={() => undefined}
          onNew={() => undefined}
          onOrderChange={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })
})
