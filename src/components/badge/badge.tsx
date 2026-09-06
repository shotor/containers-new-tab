import { SvgIcon } from '@/components/svg-icon/svg-icon'

import css from './badge.module.css'

export type BadgeProps = {
  label: string
  color?: string
  icon?: string
}

/**
 * Small label with a color dot, or a glyph painted in that color.
 * @param props - Display label, optional CSS color, and optional glyph name.
 * @returns The rendered badge.
 */
export const Badge: React.FC<BadgeProps> = ({ label, color, icon }) => (
  <span class={css.root} style={color ? { '--badge-color': color } : undefined}>
    {icon ? <SvgIcon name={icon} class={css.icon} /> : <span class={css.dot} />}
    {label}
  </span>
)
