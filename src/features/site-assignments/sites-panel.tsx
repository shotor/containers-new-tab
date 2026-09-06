import { useMemo, useState } from 'preact/hooks'

import { Badge } from '@/components/badge/badge'
import { Button } from '@/components/button/button'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog/delete-confirm-dialog'
import { EmptyState } from '@/components/empty-state/empty-state'
import { Notice } from '@/components/notice/notice'
import { Search } from '@/components/search/search'
import { SiteRow } from '@/components/site-row/site-row'
import { SvgIcon } from '@/components/svg-icon/svg-icon'
import { type TabItem, Tabs } from '@/components/tabs/tabs'

import { colorCodeFor } from '@/data/browser/browser-api'
import type { NewShortcut } from '@/data/shortcuts/shortcuts-api'

import { useSortedContainers } from '@/features/container-grid/hooks/use-sorted-containers'
import { ShortcutForm } from '@/features/shortcuts/components/shortcut-form'
import { useShortcuts } from '@/features/shortcuts/hooks/use-shortcuts'
import { useAssignedSites } from '@/features/site-assignments/hooks/use-assigned-sites'

import { openContainerTab } from '@/utils/browser/open-container-tab'
import { fuzzyFilterSorted } from '@/utils/search/fuzzy-filter-sorted'
import { siteLabelFromUrl } from '@/utils/url/site-label-from-url'

import css from './sites-panel.module.css'

type SitesTab = 'shortcuts' | 'assigned'

const TABS: TabItem<SitesTab>[] = [
  { label: 'Shortcuts', value: 'shortcuts' },
  { label: 'Assigned websites', value: 'assigned' },
]

/** A row in either tab. Shortcuts carry an id so they can be edited/removed. */
type SiteEntry = { id?: string; url: string; cookieStoreId: string }

/** Which shortcut form is open: a new one, or an existing shortcut by id. */
type FormTarget = 'new' | { id: string }

/**
 * Home-page website list with two tabs: user-defined shortcuts (each opening
 * in a chosen container, editable and removable) and Multi-Account Containers
 * site assignments.
 * @returns The rendered tabbed panel.
 */
export const SitesPanel: React.FC = () => {
  const { containers } = useSortedContainers()
  const shortcutsState = useShortcuts()
  const assigned = useAssignedSites()
  const [tab, setTab] = useState<SitesTab>('shortcuts')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState<FormTarget | null>(null)
  const [removing, setRemoving] = useState<SiteEntry | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const byId = useMemo(
    () => new Map(containers.map((c) => [c.cookieStoreId, c])),
    [containers],
  )

  const sites: SiteEntry[] =
    tab === 'shortcuts' ? shortcutsState.shortcuts : assigned.sites
  const loading =
    tab === 'shortcuts' ? shortcutsState.loading : assigned.loading

  const rows = useMemo(
    () => fuzzyFilterSorted(sites, query, (site) => siteLabelFromUrl(site.url)),
    [sites, query],
  )

  const closeForms = () => {
    setForm(null)
    setRemoving(null)
    setError('')
  }

  const badgeFor = (cookieStoreId: string) => {
    const identity = byId.get(cookieStoreId)

    return (
      <Badge
        label={identity ? identity.name : 'No container'}
        icon={identity?.icon}
        color={
          identity
            ? identity.colorCode || colorCodeFor(identity.color)
            : undefined
        }
      />
    )
  }

  /**
   * Run a shortcut mutation, keeping the open form/dialog with the message on failure.
   * @param action - The storage change to apply.
   * @param fallback - Message when the failure has none.
   */
  const mutate = async (
    action: () => Promise<void>,
    fallback: string,
  ): Promise<void> => {
    setBusy(true)
    setError('')

    try {
      await action()
      closeForms()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : fallback)
    } finally {
      setBusy(false)
    }
  }

  const saveShortcut = (input: Required<NewShortcut>) =>
    mutate(
      () =>
        form !== null && form !== 'new'
          ? shortcutsState.update(form.id, input)
          : shortcutsState.add(input),
      'Could not save shortcut.',
    )

  const removeShortcut = () =>
    mutate(async () => {
      if (removing?.id !== undefined) {
        await shortcutsState.remove(removing.id)
      }
    }, 'Could not remove shortcut.')

  const shortcutForm = (target: FormTarget, site?: SiteEntry) => (
    <ShortcutForm
      key={target === 'new' ? 'new' : target.id}
      containers={containers}
      initial={
        site ? { cookieStoreId: site.cookieStoreId, url: site.url } : undefined
      }
      busy={busy}
      error={error}
      onSave={(input) => void saveShortcut(input)}
      onCancel={closeForms}
      onDelete={
        site
          ? () => {
              setError('')
              setRemoving(site)
            }
          : undefined
      }
    />
  )

  const empty = loading ? (
    <Notice>Loading websites…</Notice>
  ) : tab === 'shortcuts' ? (
    <EmptyState
      title="No shortcuts yet"
      description="Add a website and pick the container it opens in."
      icon={
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
        >
          <path d="M36 6 16 36h14l-2 22 20-30H34z" />
        </svg>
      }
    />
  ) : (
    <Notice>No websites assigned to a container yet.</Notice>
  )

  const addingNew = tab === 'shortcuts' && form === 'new'

  return (
    <>
      <Tabs
        class={css.tabs}
        label="Websites"
        items={TABS}
        value={tab}
        onChange={(next) => {
          setTab(next)
          closeForms()
        }}
      />

      {sites.length === 0 ? (
        !addingNew && empty
      ) : (
        <>
          <Search
            id="sites-search"
            label="Search websites"
            value={query}
            placeholder="Search websites…"
            onChange={setQuery}
          />

          {rows.length === 0 && (
            <Notice>No sites match “{query.trim()}”.</Notice>
          )}

          {rows.length > 0 && (
            <ul class={css.list} role="tabpanel">
              {rows.map((site) => (
                <li key={site.id ?? site.url}>
                  {site.id !== undefined &&
                  form !== null &&
                  form !== 'new' &&
                  form.id === site.id ? (
                    shortcutForm(form, site)
                  ) : (
                    <SiteRow
                      url={site.url}
                      badge={badgeFor(site.cookieStoreId)}
                      action={
                        site.id !== undefined && (
                          <>
                            <Button
                              variant="ghost"
                              class={css.rowAction}
                              title="Edit shortcut"
                              aria-label={`Edit ${siteLabelFromUrl(site.url)}`}
                              onClick={() => {
                                setError('')
                                setForm({ id: site.id! })
                              }}
                            >
                              <SvgIcon name="edit" />
                            </Button>
                            <Button
                              variant="ghost"
                              class={css.rowAction}
                              title="Remove shortcut"
                              aria-label={`Remove ${siteLabelFromUrl(site.url)}`}
                              onClick={() => {
                                setError('')
                                setRemoving(site)
                              }}
                            >
                              ×
                            </Button>
                          </>
                        )
                      }
                      onOpen={(url, beside) =>
                        void openContainerTab(site.cookieStoreId, url, {
                          replaceCurrent: !beside,
                        })
                      }
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === 'shortcuts' &&
        (addingNew ? (
          shortcutForm('new')
        ) : (
          <div class={css.actions}>
            <Button class={css.add} onClick={() => setForm('new')}>
              <span class={css.plus} aria-hidden="true">
                +
              </span>
              Add shortcut
            </Button>
          </div>
        ))}

      {removing && (
        <DeleteConfirmDialog
          name={siteLabelFromUrl(removing.url)}
          description="This removes the shortcut from this page. The website and its container are not affected."
          busy={busy}
          error={error}
          onCancel={closeForms}
          onConfirm={() => void removeShortcut()}
        />
      )}
    </>
  )
}
