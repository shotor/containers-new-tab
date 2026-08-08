import { closestCenter, DndContext } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import {
  TileGridLayout,
  type TileGridProps,
} from '@/features/container-grid/components/tile-grid'
import { colorCodeFor } from '@/data/browser/browser-api'
import { ContainerTile } from '@/features/container-grid/components/container-tile'
import { prefetchContainerDetail } from '@/features/container-detail/prefetch-container-detail'
import { SortableTile } from '@/components/sortable-tile/sortable-tile'
import { useTileGrid } from '@/features/container-grid/hooks/use-tile-grid'

/**
 * Drag-sortable container tile grid (loads @dnd-kit).
 * @param props - Containers, sort state, and grid callbacks.
 * @returns The rendered grid with its drag context.
 */
export const SortableTileGrid: React.FC<TileGridProps> = ({
  identities,
  sortableEnabled,
  currentStoreId,
  onOpen,
  onEdit,
  onNew,
  onOrderChange,
}) => {
  const {
    isSortingDrag,
    sortableIds,
    sensors,
    onDragStart,
    onDragEnd,
    onDragCancel,
  } = useTileGrid({ identities, onOrderChange })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
        <TileGridLayout
          identities={identities}
          currentStoreId={currentStoreId}
          isSortingDrag={isSortingDrag}
          onOpen={onOpen}
          onNew={onNew}
          renderIdentity={(identity) => (
            <SortableTile
              key={identity.cookieStoreId}
              id={identity.cookieStoreId}
              sortable={sortableEnabled}
            >
              {({
                nodeRef,
                style,
                dragAttributes,
                dragListeners,
                dragging,
              }) => (
                <ContainerTile
                  name={identity.name}
                  color={identity.colorCode || colorCodeFor(identity.color)}
                  icon={identity.icon}
                  sortable={sortableEnabled}
                  current={currentStoreId === identity.cookieStoreId}
                  dragging={dragging}
                  nodeRef={nodeRef}
                  style={style}
                  dragAttributes={dragAttributes}
                  dragListeners={dragListeners}
                  onOpen={(opts) => onOpen(identity.cookieStoreId, opts)}
                  onEdit={() => onEdit(identity.cookieStoreId)}
                  onPrefetch={() =>
                    prefetchContainerDetail(identity.cookieStoreId)
                  }
                />
              )}
            </SortableTile>
          )}
        />
      </SortableContext>
    </DndContext>
  )
}
