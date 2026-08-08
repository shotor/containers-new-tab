import { closestCenter, DndContext } from '@dnd-kit/core'
import {
  type ContainerIdentity,
  DEFAULT_COOKIE_STORE,
} from '@/data/browser/types'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { colorCodeFor } from '@/data/browser/browser-api'
import { ContainerTile } from '@/features/container-grid/components/container-tile'
import css from './tile-grid.module.css'
import { SortableTile } from '@/components/sortable-tile/sortable-tile'
import { useTileGrid } from '@/features/container-grid/hooks/use-tile-grid'

export type TileGridProps = {
  identities: ContainerIdentity[]
  sortableEnabled: boolean
  currentStoreId: string
  onOpen: (cookieStoreId: string, opts?: { replaceCurrent?: boolean }) => void
  onEdit: (cookieStoreId: string) => void
  onNew: () => void
  onOrderChange: (order: string[]) => void
}

/**
 * The container tile grid: fixed tiles, sortable container tiles, drag wiring.
 * @param props - Containers, sort state, and grid callbacks.
 * @returns The rendered grid with its drag context.
 */
export const TileGrid: React.FC<TileGridProps> = ({
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
        <div class={css.root} role="list">
          <ContainerTile
            name="No Container"
            icon="circle"
            variant="default"
            muted={isSortingDrag}
            current={currentStoreId === DEFAULT_COOKIE_STORE}
            onOpen={(opts) => onOpen(DEFAULT_COOKIE_STORE, opts)}
          />

          {identities.map((identity) => (
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
                />
              )}
            </SortableTile>
          ))}

          <ContainerTile
            name="New container"
            variant="new"
            muted={isSortingDrag}
            onOpen={() => onNew()}
          />
        </div>
      </SortableContext>
    </DndContext>
  )
}
