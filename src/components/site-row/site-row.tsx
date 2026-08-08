import { Button } from '@/components/button/button'
import type { ComponentChildren } from 'preact'
import css from './site-row.module.css'
import { parseHostname } from '@/utils/url/parse-hostname'
import { pointerOpenHandlers } from '@/utils/browser/pointer-open-handlers'
import { siteLabelFromUrl } from '@/utils/url/site-label-from-url'

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
  onOpen: (url: string, beside: boolean) => void
}

/**
 * A site-assignment row: favicon, site label, optional trailing badge.
 * @param props - URL to open/display, optional badge, and open callback.
 * @returns The rendered row button.
 */
export const SiteRow: React.FC<SiteRowProps> = ({ url, badge, onOpen }) => {
  const label = siteLabelFromUrl(url)
  const host = parseHostname(url) ?? label

  return (
    <Button
      variant="plain"
      class={css.root}
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
  )
}
