import type { ComponentChildren } from 'preact'

import { Button } from '@/components/button/button'

import { pointerOpenHandlers } from '@/utils/browser/pointer-open-handlers'
import { parseHostname } from '@/utils/url/parse-hostname'
import { siteLabelFromUrl } from '@/utils/url/site-label-from-url'

import css from './site-row.module.css'

/**
 * Build the favicon image URL for a hostname (Google favicon service).
 * @param host - Hostname to fetch the favicon for.
 * @returns The favicon image URL.
 */
const faviconUrl = (host: string): string =>
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`

export type SiteRowProps = {
  url: string
  badge?: ComponentChildren
  /** Trailing control rendered inside the card (e.g. a remove button). */
  action?: ComponentChildren
  onOpen: (url: string, beside: boolean) => void
}

/**
 * A site card: favicon, hostname label, optional badge, optional trailing action.
 * @param props - URL to open/display, optional badge/action, and open callback.
 * @returns The rendered card.
 */
export const SiteRow: React.FC<SiteRowProps> = ({
  url,
  badge,
  action,
  onOpen,
}) => {
  const label = siteLabelFromUrl(url)
  const host = parseHostname(url) ?? label

  return (
    <div class={css.root}>
      <Button
        variant="plain"
        class={css.open}
        title={url}
        {...pointerOpenHandlers((beside) => onOpen(url, beside))}
      >
        <img
          class={css.favicon}
          alt=""
          src={faviconUrl(host)}
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden'
          }}
        />
        <span class={css.title}>{label}</span>
        {badge}
      </Button>

      {action && <span class={css.action}>{action}</span>}
    </div>
  )
}
