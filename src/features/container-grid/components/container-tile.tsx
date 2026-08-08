import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core'
import { Button } from '@/components/button/button'
import css from './container-tile.module.css'
import type { CSSProperties } from 'preact'
import cx from 'classnames'
import { pointerOpenHandlers } from '@/utils/browser/pointer-open-handlers'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

/** Visual role of a container tile. */
export type ContainerTileVariant = 'container' | 'default' | 'new'

export type ContainerTileProps = {
  name: string
  color?: string
  icon?: string
  variant?: ContainerTileVariant
  current?: boolean
  muted?: boolean
  sortable?: boolean
  dragging?: boolean
  nodeRef?: (node: HTMLElement | null) => void
  style?: CSSProperties
  dragAttributes?: DraggableAttributes
  dragListeners?: DraggableSyntheticListeners
  onOpen: (opts?: { replaceCurrent?: boolean }) => void
  onEdit?: () => void
}

/**
 * One container tile: icon, name, optional edit affordance.
 * @param props - Display data, drag wiring, and open/edit callbacks.
 * @returns The rendered tile.
 */
export const ContainerTile: React.FC<ContainerTileProps> = ({
  name,
  color,
  icon,
  variant = 'container',
  current,
  muted,
  sortable,
  dragging,
  nodeRef,
  style: styleProp,
  dragAttributes,
  dragListeners,
  onOpen,
  onEdit,
}) => {
  const style: CSSProperties = {
    ...(color ? { '--tile-color': color } : {}),
    ...styleProp,
  }

  return (
    <div
      ref={nodeRef}
      class={cx(
        css.root,
        variant === 'default' && css.noContainer,
        muted && css.muted,
        current && css.current,
        sortable && css.sortable,
        dragging && css.dragging,
      )}
      style={style}
      {...dragAttributes}
      {...dragListeners}
      role="listitem"
      aria-current={current ? 'true' : undefined}
    >
      <Button
        variant="plain"
        class={css.open}
        aria-label={current ? `${name} (current)` : name}
        {...pointerOpenHandlers((beside) =>
          onOpen({ replaceCurrent: !beside }),
        )}
      >
        {variant === 'new' ? (
          <span class={css.iconWrap} aria-hidden="true">
            <span class={css.plus}>+</span>
          </span>
        ) : null}

        {variant !== 'new' && icon ? (
          <span class={css.iconWrap} aria-hidden="true">
            <SvgIcon name={icon} class={css.icon} />
          </span>
        ) : null}

        <span class={css.name}>{name}</span>
      </Button>

      {onEdit ? (
        <Button
          class={css.edit}
          title="Edit container"
          aria-label={`Edit ${name}`}
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <SvgIcon name="edit" size={14} />
        </Button>
      ) : null}
    </div>
  )
}
