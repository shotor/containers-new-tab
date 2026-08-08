import css from './save-status-indicator.module.css'
import cx from 'classnames'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

/** Save feedback state for debounced editor writes. */
export type SaveStatus = 'idle' | 'pending' | 'saved'

export type SaveStatusIndicatorProps = {
  status: SaveStatus
  class?: string
}

/**
 * Inline spinner/check reflecting a debounced save state.
 * @param props - The save status to display and optional root class.
 * @returns The rendered indicator, or null when idle.
 */
export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  status,
  class: className,
}) => {
  if (status === 'idle') {
    return null
  }

  return (
    <span
      class={cx(css.root, status === 'saved' && css.saved, className)}
      aria-live="polite"
      aria-label={status === 'pending' ? 'Saving' : 'Saved'}
    >
      {status === 'pending' ? (
        <span class={css.spinner} aria-hidden="true" />
      ) : (
        <SvgIcon name="check" class={css.check} />
      )}
    </span>
  )
}
