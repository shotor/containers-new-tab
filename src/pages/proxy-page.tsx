import { useEffect, useState } from 'preact/hooks'
import { Button } from '@/components/button/button'
import css from './proxy-page.module.css'
import { ProxyRow } from '@/features/proxies/components/proxy-row'
import { sortProxies } from '@/data/utils/sort-proxies'
import { useProxyLibrary } from '@/features/proxies/hooks/use-proxy-library'
import { useProxySort } from '@/features/proxies/hooks/use-proxy-sort'

export type ProxyPageProps = {
  /** False while another page is shown; discards open editors. */
  active?: boolean
}

/**
 * Reusable proxy library with inline creation, editing and removal.
 * @param props - Whether the page is currently visible.
 * @returns The proxy management page content.
 */
export const ProxyPage: React.FC<ProxyPageProps> = ({ active = true }) => {
  const { library, loading, error } = useProxyLibrary()
  const { sortMode, sortDirection } = useProxySort()
  const [newId, setNewId] = useState('')
  const entries = sortProxies(
    Object.entries(library.proxies).map(([id, proxy]) => ({
      id,
      proxy,
      usage: Object.values(library.assignments).filter(
        (assigned) => assigned === id,
      ).length,
    })),
    sortMode,
    sortDirection,
  )

  useEffect(() => {
    if (!active) {
      setNewId('')
    }
  }, [active])

  return (
    <div class={css.root}>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading proxies…</p>
      ) : (
        <>
          {!error && !newId && Object.keys(library.proxies).length === 0 && (
            <div class={css.empty}>
              <svg
                class={css.emptyIcon}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <rect x="5" y="21" width="16" height="22" rx="5" />
                <rect x="43" y="21" width="16" height="22" rx="5" />
                <path d="M21 28h22m-22 8h22m-6-14 6 6-6 6M27 30l-6 6 6 6" />
              </svg>
              <h2 class={css.emptyTitle}>No proxies yet</h2>
              <p class={css.emptyDescription}>
                Add your first proxy to use it with your containers.
              </p>
            </div>
          )}

          {entries.map(({ id, proxy, usage }) => (
            <ProxyRow
              key={id}
              id={id}
              proxy={proxy}
              active={active}
              usage={usage}
            />
          ))}

          {newId ? (
            <ProxyRow
              key={newId}
              id={newId}
              isNew
              usage={0}
              proxy={{
                doNotProxyLocal: true,
                host: '',
                name: '',
                port: 0,
                type: 'http',
              }}
              onClose={() => setNewId('')}
            />
          ) : (
            <div class={css.actions}>
              <Button
                class={css.newProxy}
                disabled={Boolean(error)}
                onClick={() => setNewId(crypto.randomUUID())}
              >
                <span class={css.plus} aria-hidden="true">
                  +
                </span>
                New proxy
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
