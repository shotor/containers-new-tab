import type { ComponentChildren } from 'preact'
import css from './page-section.module.css'
import { useId } from 'preact/hooks'

export type PageSectionProps = {
  title?: ComponentChildren
  children?: ComponentChildren
}

/**
 * Page region with optional heading plus body content.
 * @param props - Optional section title and children.
 * @returns The rendered section.
 */
export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
}) => {
  const headingId = useId()

  return (
    <section
      class={css.root}
      aria-labelledby={title != null ? headingId : undefined}
    >
      {title != null && (
        <h2 id={headingId} class={css.title}>
          {title}
        </h2>
      )}

      {children}
    </section>
  )
}
