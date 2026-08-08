import css from './magnificence.module.css'

/**
 * Tiny corner camel that fades in when the pointer nears the bottom-right.
 * @returns The decorative easter egg.
 */
export const Magnificence: React.FC = () => (
  <div class={css.root} aria-hidden="true">
    <span class={css.emoji}>🐪</span>
  </div>
)
