import {
  colorCodeFor,
  gatherAssignmentProbeUrls,
  type MacSiteAssignment,
  probeMacAssignments,
} from '@/data/browser/browser-api'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { Badge } from '@/components/badge/badge'
import css from './site-assignments.module.css'
import { fuzzyFilterSorted } from '@/utils/search/fuzzy-filter-sorted'
import { Notice } from '@/components/notice/notice'
import { openContainerTab } from '@/utils/browser/open-container-tab'
import { Search } from '@/components/search/search'
import { siteLabelFromUrl } from '@/utils/url/site-label-from-url'
import { SiteRow } from '@/components/site-row/site-row'
import { useSortedContainers } from '@/features/container-grid/hooks/use-sorted-containers'

/**
 * Searchable MAC site-assignment list for the home page.
 * @returns The rendered assignments list.
 */
export const SiteAssignments: React.FC = () => {
  const { containers } = useSortedContainers()

  const [query, setQuery] = useState('')
  const [siteAssignments, setSiteAssignments] = useState<
    Record<string, MacSiteAssignment>
  >({})

  useEffect(() => {
    const load = async () => {
      const probes = await gatherAssignmentProbeUrls()
      setSiteAssignments(await probeMacAssignments(probes))
    }

    void load()
  }, [])

  const all = useMemo(() => Object.values(siteAssignments), [siteAssignments])

  const rows = useMemo(
    () => fuzzyFilterSorted(all, query, (site) => siteLabelFromUrl(site.url)),
    [all, query],
  )

  const byId = useMemo(
    () => new Map(containers.map((c) => [c.cookieStoreId, c])),
    [containers],
  )

  if (all.length === 0) {
    return <Notice>No websites assigned to this container.</Notice>
  }

  return (
    <>
      <Search
        id="sites-search"
        label="Search websites"
        value={query}
        placeholder="Search websites…"
        onChange={setQuery}
      />

      {rows.length === 0 && <Notice>No sites match “{query.trim()}”.</Notice>}

      {rows.length > 0 && (
        <ul class={css.list}>
          {rows.map((site) => {
            const identity = byId.get(site.cookieStoreId)

            return (
              <li key={site.host}>
                <SiteRow
                  url={site.url}
                  badge={
                    <Badge
                      label={identity ? identity.name : 'No container'}
                      color={
                        identity
                          ? identity.colorCode || colorCodeFor(identity.color)
                          : undefined
                      }
                    />
                  }
                  onOpen={(url, beside) =>
                    void openContainerTab(site.cookieStoreId, url, {
                      replaceCurrent: !beside,
                    })
                  }
                />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
