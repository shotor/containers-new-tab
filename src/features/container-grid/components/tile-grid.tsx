import type { ComponentChildren } from 'preact'

import {
  type ContainerIdentity,
  DEFAULT_COOKIE_STORE,
} from '@/data/browser/types'
import { colorCodeFor } from '@/data/browser/browser-api'
import { ContainerTile } from '@/features/container-grid/components/container-tile'
import css from './tile-grid.module.css'
import { prefetchContainerDetail } from '@/features/container-detail/prefetch-container-detail'

export type TileGridProps = {
  identities: ContainerIdentity[]
  sortableEnabled: boolean
  currentStoreId: string
  onOpen: (cookieStoreId: string, opts?: { replaceCurrent?: boolean }) => void
  onEdit: (cookieStoreId: string) => void
  onNew: () => void
  onOrderChange: (order: string[]) => void
}

export type TileGridLayoutProps = {
  identities: ContainerIdentity[]
  currentStoreId: string
  isSortingDrag?: boolean
  onOpen: TileGridProps['onOpen']
  onNew: TileGridProps['onNew']
  renderIdentity: (identity: ContainerIdentity) => ComponentChildren
}

/**
 * Shared tile list shell: fixed ends plus caller-rendered container tiles.
 * @param props - Grid callbacks and per-identity renderer.
 * @returns The rendered list.
 */
export const TileGridLayout: React.FC<TileGridLayoutProps> = ({
  currentStoreId,
  isSortingDrag = false,
  onOpen,
  onNew,
  renderIdentity,
  identities,
}) => (
  <div class={css.root} role="list">
    <ContainerTile
      name="No Container"
      icon="circle"
      variant="default"
      muted={isSortingDrag}
      current={currentStoreId === DEFAULT_COOKIE_STORE}
      onOpen={(opts) => onOpen(DEFAULT_COOKIE_STORE, opts)}
    />

    {identities.map((identity) => renderIdentity(identity))}

    <ContainerTile
      name="New container"
      variant="new"
      muted={isSortingDrag}
      onOpen={() => onNew()}
    />
  </div>
)

/**
 * Non-sortable container tile grid (no dnd-kit).
 * @param props - Containers and grid callbacks.
 * @returns The rendered grid.
 */
export const TileGrid: React.FC<TileGridProps> = ({
  identities,
  currentStoreId,
  onOpen,
  onEdit,
  onNew,
}) => (
  <TileGridLayout
    identities={identities}
    currentStoreId={currentStoreId}
    onOpen={onOpen}
    onNew={onNew}
    renderIdentity={(identity) => (
      <ContainerTile
        key={identity.cookieStoreId}
        name={identity.name}
        color={identity.colorCode || colorCodeFor(identity.color)}
        icon={identity.icon}
        current={currentStoreId === identity.cookieStoreId}
        onOpen={(opts) => onOpen(identity.cookieStoreId, opts)}
        onEdit={() => onEdit(identity.cookieStoreId)}
        onPrefetch={() => prefetchContainerDetail(identity.cookieStoreId)}
      />
    )}
  />
)
