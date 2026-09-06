import type { ComponentChildren } from 'preact'

import css from './empty-state.module.css'

export type EmptyStateProps = {
  /** Outline glyph drawn in the accent color (an inline `<svg>`). */
  icon: ComponentChildren
  title: string
  description: string
}

/**
 * Inset "nothing here yet" panel with an icon, title and hint.
 * @param props - Icon, title and description.
 * @returns The rendered empty state.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
}) => (
  <div class={css.root}>
    <span class={css.icon} aria-hidden="true">
      {icon}
    </span>
    <h2 class={css.title}>{title}</h2>
    <p class={css.description}>{description}</p>
  </div>
)
