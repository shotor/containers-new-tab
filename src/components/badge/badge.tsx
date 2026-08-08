import css from './badge.module.css'

export type BadgeProps = {
  label: string
  color?: string
}

/**
 * Small label with an optional color dot.
 * @param props - Display label and optional CSS color for the dot.
 * @returns The rendered badge.
 */
export const Badge: React.FC<BadgeProps> = ({ label, color }) => (
  <span class={css.root}>
    <span
      class={css.dot}
      style={color ? { '--badge-color': color } : undefined}
    />
    {label}
  </span>
)
