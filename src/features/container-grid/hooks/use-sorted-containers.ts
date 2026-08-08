import {
  DEFAULT_STORE,
  type ExtensionStorageObject,
  type SortMode,
} from '@/data/types'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { extensionStorageApi } from '@/data/extension/extension-storage-api'
import { sortContainers } from '@/data/utils/sort'

/** Sort-related fields used to order the container grid. */
type SortStore = Pick<
  ExtensionStorageObject,
  'sortMode' | 'usageCounts' | 'customOrder'
>

const DEFAULT_SORT_STORE: SortStore = {
  customOrder: DEFAULT_STORE.customOrder,
  sortMode: DEFAULT_STORE.sortMode,
  usageCounts: DEFAULT_STORE.usageCounts,
}

/** Storage keys that affect sorted containers. */
const SORT_STORAGE_KEYS = ['sortMode', 'usageCounts', 'customOrder'] as const

/**
 * Sort identities using fields from a sort snapshot.
 * @param identities - Unsorted container identities.
 * @param sortStore - Sort mode, usage counts, and custom order.
 * @returns A new sorted array.
 */
const sortedContainers = (
  identities: browser.contextualIdentities.ContextualIdentity[],
  sortStore: SortStore,
): browser.contextualIdentities.ContextualIdentity[] =>
  sortContainers({
    containers: identities,
    customOrder: sortStore.customOrder,
    sortMode: sortStore.sortMode,
    usageCounts: sortStore.usageCounts,
  })

/**
 * Load the sort-related fields from extension storage.
 * @returns Validated sortMode, usageCounts, and customOrder.
 */
const loadSortStore = async (): Promise<SortStore> => {
  const [sortMode, usageCounts, customOrder] = await Promise.all([
    extensionStorageApi.get('sortMode'),
    extensionStorageApi.get('usageCounts'),
    extensionStorageApi.get('customOrder'),
  ])

  return { customOrder, sortMode, usageCounts }
}

/**
 * Sorted container list plus sort-mode controls for the home grid.
 * Syncs with storage and `contextualIdentities` events while mounted.
 * @returns Sort mode, sorted containers, and setters.
 */
export const useSortedContainers = () => {
  const [sortStore, setSortStore] = useState<SortStore>(DEFAULT_SORT_STORE)
  const [containers, setContainers] = useState<
    browser.contextualIdentities.ContextualIdentity[]
  >([])

  /**
   * Reload sort fields and re-sort containers from the browser.
   */
  const refresh = useCallback(async (): Promise<void> => {
    const nextSort = await loadSortStore()
    let identities: browser.contextualIdentities.ContextualIdentity[] = []

    try {
      identities = await extensionStorageApi.getContainers()
    } catch {
      identities = []
    }

    setSortStore(nextSort)
    setContainers(sortedContainers(identities, nextSort))
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const onIdentities = () => {
      void refresh()
    }

    browser.contextualIdentities.onCreated.addListener(onIdentities)
    browser.contextualIdentities.onUpdated.addListener(onIdentities)
    browser.contextualIdentities.onRemoved.addListener(onIdentities)

    const onStorage = (
      changes: { [key: string]: browser.storage.StorageChange },
      area: string,
    ) => {
      if (area !== 'local') {
        return
      }

      const touched = SORT_STORAGE_KEYS.some((key) => key in changes)
      if (touched) {
        void refresh()
      }
    }

    browser.storage.onChanged.addListener(onStorage)

    return () => {
      browser.contextualIdentities.onCreated.removeListener(onIdentities)
      browser.contextualIdentities.onUpdated.removeListener(onIdentities)
      browser.contextualIdentities.onRemoved.removeListener(onIdentities)
      browser.storage.onChanged.removeListener(onStorage)
    }
  }, [refresh])

  /**
   * Update sort mode in state and persist it.
   * @param mode - The sort mode to apply.
   */
  const setSortMode = useCallback(
    async (mode: SortMode): Promise<void> => {
      const nextSort = { ...sortStore, sortMode: mode }
      setSortStore(nextSort)
      setContainers(sortedContainers(containers, nextSort))
      await extensionStorageApi.set({ sortMode: mode })
    },
    [sortStore, containers],
  )

  /**
   * Persist a drag order; switches to custom mode when needed.
   * @param order - cookieStoreIds in display order.
   */
  const setCustomOrder = useCallback(
    async (order: string[]): Promise<void> => {
      const patch: Partial<ExtensionStorageObject> = { customOrder: order }
      const nextSort: SortStore = {
        ...sortStore,
        customOrder: order,
        sortMode:
          sortStore.sortMode === 'custom' ? sortStore.sortMode : 'custom',
      }

      if (sortStore.sortMode !== 'custom') {
        patch.sortMode = 'custom'
      }

      setSortStore(nextSort)
      setContainers(sortedContainers(containers, nextSort))
      await extensionStorageApi.set(patch)
    },
    [sortStore, containers],
  )

  return {
    containers,
    refresh,
    setCustomOrder,
    setSortMode,
    sortMode: sortStore.sortMode,
  }
}
