import type { ComponentChildren } from 'preact'
import css from './top-bar.module.css'

export type TopBarProps = {
  title: string
  children?: ComponentChildren
}

/**
 * Page top bar: brand title on the left, optional controls on the right.
 * @param props - Title text and optional control children.
 * @returns The rendered header.
 */
export const TopBar: React.FC<TopBarProps> = ({ title, children }) => (
  <header class={css.root}>
    <div class={css.brand}>
      <h1 class={css.brandName}>{title}</h1>
    </div>

    {children ? <div class={css.controls}>{children}</div> : null}
  </header>
)
