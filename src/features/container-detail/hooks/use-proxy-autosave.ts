import {
  type ProxyFormValues,
  proxyPersistSchema,
} from '@/features/container-detail/container-detail.schema'
import { debounce } from '@/utils/function/debounce'
import { extensionStorageApi } from '@/data/extension/extension-storage-api'
import { useEffect } from 'preact/hooks'

const PROXY_SAVE_MS = 400

/**
 * Whether two proxy form slices are identical.
 * @param a - First slice.
 * @param b - Second slice.
 * @returns True when every field matches.
 */
const proxyFormValuesEqual = (
  a: ProxyFormValues,
  b: ProxyFormValues,
): boolean =>
  a.type === b.type &&
  a.host === b.host &&
  a.port === b.port &&
  a.username === b.username &&
  a.password === b.password &&
  a.doNotProxyLocal === b.doNotProxyLocal

export type UseProxyAutosaveOptions = {
  loading: boolean
  activeCookieStoreId?: string
  type: ProxyFormValues['type']
  host: string
  port: string
  username: string
  password: string
  doNotProxyLocal: boolean
  lastProxySavedRef: { current: ProxyFormValues | null }
  setPending: () => void
  markSaved: () => void
  resetSave: () => void
}

/**
 * Debounced proxy autosave once a container identity exists.
 * @param options - Proxy form values, refs, and save-status helpers.
 */
export const useProxyAutosave = ({
  loading,
  activeCookieStoreId,
  type,
  host,
  port,
  username,
  password,
  doNotProxyLocal,
  lastProxySavedRef,
  setPending,
  markSaved,
  resetSave,
}: UseProxyAutosaveOptions): void => {
  useEffect(() => {
    if (loading || !activeCookieStoreId) {
      return
    }

    const nextProxy: ProxyFormValues = {
      doNotProxyLocal,
      host,
      password,
      port,
      type,
      username,
    }
    const saved = lastProxySavedRef.current

    if (saved && proxyFormValuesEqual(saved, nextProxy)) {
      return
    }

    const parsed = proxyPersistSchema.safeParse(nextProxy)

    if (!parsed.success) {
      resetSave()
      return
    }

    setPending()

    const save = debounce(() => {
      void (async () => {
        try {
          await extensionStorageApi.setProxyForContainer(
            activeCookieStoreId,
            parsed.data,
          )
          lastProxySavedRef.current = nextProxy
          markSaved()
        } catch {
          resetSave()
        }
      })()
    }, PROXY_SAVE_MS)

    save()

    return () => {
      save.cancel()
    }
  }, [
    loading,
    activeCookieStoreId,
    type,
    host,
    port,
    username,
    password,
    doNotProxyLocal,
    lastProxySavedRef,
    setPending,
    markSaved,
    resetSave,
  ])
}
