import type { ComponentChildren, CSSProperties } from 'preact'
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

/** Drag wiring passed to {@link SortableTile} children. */
export type SortableTileRenderProps = {
  nodeRef: (node: HTMLElement | null) => void
  style: CSSProperties
  dragAttributes: DraggableAttributes
  dragListeners: DraggableSyntheticListeners | undefined
  dragging: boolean
}

export type SortableTileProps = {
  id: string
  sortable?: boolean
  children: (props: SortableTileRenderProps) => ComponentChildren
}

/**
 * Generic dnd-kit sortable wrapper; children receive drag wiring as a render prop.
 * @param props - Sortable id, whether sorting is enabled, and render prop.
 * @returns The rendered child with drag props applied by the caller.
 */
export const SortableTile: React.FC<SortableTileProps> = ({
  id,
  sortable = true,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    disabled: !sortable,
    id,
  })

  return children({
    dragAttributes: attributes,
    dragging: isDragging,
    dragListeners: sortable ? listeners : undefined,
    nodeRef: setNodeRef,
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
    },
  })
}
