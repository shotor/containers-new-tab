import { describe, expect, it, vi } from 'vitest'
import { renderSnapshot } from '@/test/render-snapshot'
import { SortableTile } from '@/components/sortable-tile/sortable-tile'

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: { 'data-sortable': 'true' },
    isDragging: false,
    listeners: { onPointerDown: () => undefined },
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

describe('SortableTile', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <SortableTile id="store-1" sortable>
          {({ nodeRef, style, dragging }) => (
            <div ref={nodeRef} style={style} data-dragging={dragging}>
              Tile
            </div>
          )}
        </SortableTile>,
      ),
    ).toMatchSnapshot()
  })
})
