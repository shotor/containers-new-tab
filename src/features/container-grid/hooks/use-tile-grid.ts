import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { ContainerIdentity } from '@/data/browser/types'
import { useState } from 'preact/hooks'

export type UseTileGridOptions = {
  identities: ContainerIdentity[]
  onOrderChange: (order: string[]) => void
}

/**
 * Drag-sort state and handlers for the container tile grid.
 * @param options - Identities to order and the persist callback.
 * @returns Sensors, sortable ids, mid-drag flag, and dnd handlers.
 */
export const useTileGrid = ({
  identities,
  onOrderChange,
}: UseTileGridOptions) => {
  const [isSortingDrag, setIsSortingDrag] = useState(false)
  const sortableIds = identities.map((c) => c.cookieStoreId)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  /**
   * Mark the grid as mid-drag (mutes fixed tiles).
   */
  const onDragStart = (): void => {
    setIsSortingDrag(true)
  }

  /**
   * Apply a finished drag to the tile order and report it.
   * @param event - The dnd-kit drag end event.
   */
  const onDragEnd = (event: DragEndEvent): void => {
    setIsSortingDrag(false)
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const indexOf = (id: unknown) =>
      identities.findIndex((c) => c.cookieStoreId === String(id))
    const oldIndex = indexOf(active.id)
    const newIndex = indexOf(over.id)

    if (oldIndex < 0 || newIndex < 0) {
      return
    }

    onOrderChange(
      arrayMove(identities, oldIndex, newIndex).map((c) => c.cookieStoreId),
    )
  }

  /**
   * Clear the mid-drag marker without persisting anything.
   */
  const onDragCancel = (): void => {
    setIsSortingDrag(false)
  }

  return {
    isSortingDrag,
    onDragCancel,
    onDragEnd,
    onDragStart,
    sensors,
    sortableIds,
  }
}
