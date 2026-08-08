import css from './assigned-sites.module.css'
import { fuzzyFilterSorted } from '@/utils/search/fuzzy-filter-sorted'
import type { MacSiteAssignment } from '@/data/browser/browser-api'
import { Notice } from '@/components/notice/notice'
import { Search } from '@/components/search/search'
import { siteLabelFromUrl } from '@/utils/url/site-label-from-url'
import { SiteRow } from '@/components/site-row/site-row'
import { useState } from 'preact/hooks'

export type AssignedSitesProps = {
  sites: MacSiteAssignment[]
  onOpenSite: (url: string, opts?: { active?: boolean }) => void
}

/**
 * Searchable list of the container's MAC-assigned websites.
 * @param props - Assigned sites and the open callback.
 * @returns The rendered site list.
 */
export const AssignedSites: React.FC<AssignedSitesProps> = ({
  sites,
  onOpenSite,
}) => {
  const [query, setQuery] = useState('')
  const rows = fuzzyFilterSorted(sites, query, (site) =>
    siteLabelFromUrl(site.url),
  )

  if (sites.length === 0) {
    return <Notice>No websites assigned to this container.</Notice>
  }

  return (
    <>
      <Search
        id="detail-sites-search"
        label="Search websites"
        value={query}
        placeholder="Search websites…"
        onChange={setQuery}
      />

      {rows.length === 0 && <Notice>No sites match “{query.trim()}”.</Notice>}

      {rows.length > 0 && (
        <ul class={css.list}>
          {rows.map((site) => (
            <li key={site.host}>
              <SiteRow
                url={site.url}
                onOpen={(url, beside) => onOpenSite(url, { active: !beside })}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
