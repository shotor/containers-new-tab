import css from './input.module.css'
import cx from 'classnames'
import { forwardRef } from 'preact/compat'
import type { JSX } from 'preact'

export type InputProps = Omit<JSX.IntrinsicElements['input'], 'class'> & {
  class?: string
}

/**
 * Shared neumorphic text-like input.
 * @param props - Optional extra class and native input attrs.
 * @returns The rendered input.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ class: className, ...rest }, ref) => (
    <input ref={ref} class={cx(css.root, className)} {...rest} />
  ),
)

export type SelectProps = Omit<JSX.IntrinsicElements['select'], 'class'> & {
  class?: string
}

/**
 * Shared neumorphic select, styled to match {@link Input}.
 * @param props - Optional extra class and native select attrs.
 * @returns The rendered select.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ class: className, ...rest }, ref) => (
    <select ref={ref} class={cx(css.root, className)} {...rest} />
  ),
)
