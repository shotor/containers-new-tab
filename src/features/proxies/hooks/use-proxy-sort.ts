import { DEFAULT_STORE, type ProxySortMode } from '@/data/types'
import { type SortSelection, toggleSortSelection } from '@/data/utils/sort'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { extensionStorageApi } from '@/data/extension/extension-storage-api'

/** Storage keys that hold the proxy list sort. */
const PROXY_SORT_KEYS = ['proxySortMode', 'proxySortDirection'] as const

/**
 * Persisted sort for the proxy list, synced with extension storage.
 * Re-selecting the active mode flips its direction.
 * @returns Sort mode, direction and the setter.
 */
export const useProxySort = () => {
  const [sort, setSort] = useState<SortSelection<ProxySortMode>>({
    direction: DEFAULT_STORE.proxySortDirection,
    mode: DEFAULT_STORE.proxySortMode,
  })

  useEffect(() => {
    let active = true

    const load = async () => {
      const [mode, direction] = await Promise.all([
        extensionStorageApi.get('proxySortMode'),
        extensionStorageApi.get('proxySortDirection'),
      ])

      if (active) {
        setSort({ direction, mode })
      }
    }

    const onStorage = (
      changes: { [key: string]: browser.storage.StorageChange },
      area: string,
    ) => {
      if (area === 'local' && PROXY_SORT_KEYS.some((key) => key in changes)) {
        void load()
      }
    }

    browser.storage.onChanged.addListener(onStorage)
    void load()

    return () => {
      active = false
      browser.storage.onChanged.removeListener(onStorage)
    }
  }, [])

  const setSortMode = useCallback(
    async (mode: ProxySortMode): Promise<void> => {
      const next = toggleSortSelection(sort, mode)
      setSort(next)
      await extensionStorageApi.set({
        proxySortDirection: next.direction,
        proxySortMode: next.mode,
      })
    },
    [sort],
  )

  return { setSortMode, sortDirection: sort.direction, sortMode: sort.mode }
}
