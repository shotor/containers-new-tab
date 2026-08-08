import { describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import type { ContainerIdentity } from '@/data/browser/types'
import { renderHook } from '@/test/render-hook'
import { useTileGrid } from '@/features/container-grid/hooks/use-tile-grid'

vi.mock('@dnd-kit/core', () => ({
  KeyboardSensor: class KeyboardSensor {},
  PointerSensor: class PointerSensor {},
  useSensor: () => ({}),
  useSensors: () => [],
}))

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: <T,>(items: T[], from: number, to: number) => {
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    return next
  },
  sortableKeyboardCoordinates: () => ({ x: 0, y: 0 }),
}))

const identities = [
  { cookieStoreId: 'a', name: 'A' },
  { cookieStoreId: 'b', name: 'B' },
  { cookieStoreId: 'c', name: 'C' },
] as ContainerIdentity[]

describe('useTileGrid', () => {
  it('exposes sortable ids and updates order on drag end', () => {
    const onOrderChange = vi.fn<(order: string[]) => void>()
    const { result, rerender } = renderHook(() =>
      useTileGrid({ identities, onOrderChange }),
    )

    expect(result.current.sortableIds).toEqual(['a', 'b', 'c'])

    act(() => {
      result.current.onDragStart()
    })
    rerender()
    expect(result.current.isSortingDrag).toBe(true)

    act(() => {
      result.current.onDragEnd({
        active: { id: 'a' },
        over: { id: 'c' },
      } as never)
    })
    rerender()

    expect(result.current.isSortingDrag).toBe(false)
    expect(onOrderChange).toHaveBeenCalledWith(['b', 'c', 'a'])
  })

  it('ignores no-op drag ends and clears on cancel', () => {
    const onOrderChange = vi.fn<(order: string[]) => void>()
    const { result, rerender } = renderHook(() =>
      useTileGrid({ identities, onOrderChange }),
    )

    act(() => {
      result.current.onDragStart()
      result.current.onDragEnd({
        active: { id: 'a' },
        over: { id: 'a' },
      } as never)
    })
    rerender()
    expect(onOrderChange).not.toHaveBeenCalled()

    act(() => {
      result.current.onDragStart()
      result.current.onDragCancel()
    })
    rerender()
    expect(result.current.isSortingDrag).toBe(false)
  })
})
