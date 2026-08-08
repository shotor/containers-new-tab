import type { ComponentChildren, JSX } from 'preact'
import css from './button.module.css'
import cx from 'classnames'

/** Visual variants for {@link Button}. */
export type ButtonVariant = 'default' | 'ghost' | 'danger' | 'plain'

export type ButtonProps = Omit<
  JSX.IntrinsicElements['button'],
  'class' | 'type'
> & {
  variant?: ButtonVariant
  class?: string
  type?: 'button' | 'submit' | 'reset'
  children?: ComponentChildren
}

/**
 * Shared neumorphic button.
 * @param props - Variant, optional extra class, and native button attrs.
 * @returns The rendered button.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  class: className,
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    class={cx(
      css.root,
      variant === 'ghost' && css.ghost,
      variant === 'danger' && css.danger,
      variant === 'plain' && css.plain,
      className,
    )}
    {...rest}
  />
)

export type ButtonRowProps = {
  class?: string
  children?: ComponentChildren
}

/**
 * Horizontal wrapping row for grouping buttons.
 * @param props - Optional class and child buttons.
 * @returns The rendered row.
 */
export const ButtonRow: React.FC<ButtonRowProps> = ({
  class: className,
  children,
}) => <div class={cx(css.row, className)}>{children}</div>
