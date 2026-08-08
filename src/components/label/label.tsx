import css from './label.module.css'
import cx from 'classnames'
import type { JSX } from 'preact'

export type LabelProps = Omit<JSX.IntrinsicElements['label'], 'class'> & {
  class?: string
}

/**
 * Shared field label.
 * @param props - Optional extra class and native label attrs.
 * @returns The rendered label.
 */
export const Label: React.FC<LabelProps> = ({ class: className, ...rest }) => (
  <label class={cx(css.root, className)} {...rest} />
)
