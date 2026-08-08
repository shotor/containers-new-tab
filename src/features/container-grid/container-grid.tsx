import css from './container-grid.module.css'
import cx from 'classnames'
import { openContainerTab } from '@/utils/browser/open-container-tab'
import { TileGrid } from '@/features/container-grid/components/tile-grid'
import { useCurrentStoreId } from '@/features/container-grid/hooks/use-current-store-id'
import { useLocation } from 'wouter'
import { useSortedContainers } from '@/features/container-grid/hooks/use-sorted-containers'

/**
 * Container tile grid with custom-sort hint.
 * @returns The rendered grid and hint.
 */
export const ContainerGrid: React.FC = () => {
  const [, navigate] = useLocation()
  const { containers, sortMode, setCustomOrder } = useSortedContainers()
  const currentStoreId = useCurrentStoreId()
  const sortableEnabled = sortMode === 'custom'

  return (
    <>
      <TileGrid
        identities={containers}
        sortableEnabled={sortableEnabled}
        currentStoreId={currentStoreId}
        onOpen={(cookieStoreId, opts) =>
          void openContainerTab(cookieStoreId, undefined, opts)
        }
        onEdit={(cookieStoreId) => navigate(`/edit/${cookieStoreId}`)}
        onNew={() => navigate('/new')}
        onOrderChange={(order) => {
          void setCustomOrder(order)
        }}
      />

      <p class={cx(css.hint, !sortableEnabled && 'hidden')}>
        Drag tiles to set a custom order.
      </p>
    </>
  )
}
