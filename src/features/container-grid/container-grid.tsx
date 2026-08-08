import { lazy, Suspense } from 'preact/compat'
import css from './container-grid.module.css'
import cx from 'classnames'
import { openContainerTab } from '@/utils/browser/open-container-tab'
import { TileGrid } from '@/features/container-grid/components/tile-grid'
import { useCurrentStoreId } from '@/features/container-grid/hooks/use-current-store-id'
import { useLocation } from 'wouter'
import { useSortedContainers } from '@/features/container-grid/hooks/use-sorted-containers'

const SortableTileGrid = lazy(() =>
  import('@/features/container-grid/components/sortable-tile-grid').then(
    (module) => ({ default: module.SortableTileGrid }),
  ),
)

/**
 * Container tile grid with custom-sort hint.
 * @returns The rendered grid and hint.
 */
export const ContainerGrid: React.FC = () => {
  const [, navigate] = useLocation()
  const { containers, sortMode, setCustomOrder } = useSortedContainers()
  const currentStoreId = useCurrentStoreId()
  const sortableEnabled = sortMode === 'custom'

  const gridProps = {
    currentStoreId,
    identities: containers,
    onEdit: (cookieStoreId: string) => navigate(`/edit/${cookieStoreId}`),
    onNew: () => navigate('/new'),
    onOpen: (
      cookieStoreId: string,
      opts?: { replaceCurrent?: boolean },
    ): void => {
      void openContainerTab(cookieStoreId, undefined, opts)
    },
    onOrderChange: (order: string[]): void => {
      void setCustomOrder(order)
    },
    sortableEnabled,
  }

  return (
    <>
      {sortableEnabled ? (
        <Suspense
          fallback={<TileGrid {...gridProps} sortableEnabled={false} />}
        >
          <SortableTileGrid {...gridProps} />
        </Suspense>
      ) : (
        <TileGrid {...gridProps} />
      )}

      <p class={cx(css.hint, !sortableEnabled && 'hidden')}>
        Drag tiles to set a custom order.
      </p>
    </>
  )
}
