import type { ComponentChildren } from 'preact'
import css from './notice.module.css'
import cx from 'classnames'

/** Visual variants for {@link Notice}. */
export type NoticeVariant = 'default' | 'warning'

export type NoticeProps = {
  variant?: NoticeVariant
  children: ComponentChildren
}

/**
 * Status / empty-state message, optionally styled as a warning callout.
 * @param props - Optional variant and message content.
 * @returns The rendered notice.
 */
export const Notice: React.FC<NoticeProps> = ({
  variant = 'default',
  children,
}) => (
  <p
    class={cx(css.root, variant === 'warning' && css.warning)}
    role={variant === 'warning' ? 'note' : undefined}
  >
    {children}
  </p>
)
