import { useEffect, useState } from 'preact/hooks'
import type { ProxyLibrary } from '@/data/types'
import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'

/**
 * Load the proxy library and follow changes made in other extension tabs.
 * @returns Current library, loading state and read errors.
 */
export const useProxyLibrary = () => {
  const [library, setLibrary] = useState<ProxyLibrary>({
    assignments: {},
    proxies: {},
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const next = await proxyLibraryApi.get()

        if (active) {
          setLibrary(next)
          setError('')
        }
      } catch {
        if (active) {
          setError('Could not load saved proxies.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    const onChange = (
      changes: Record<string, browser.storage.StorageChange>,
      area: string,
    ) => {
      if (area === 'local' && changes.proxyLibrary) {
        void load()
      }
    }

    browser.storage.onChanged.addListener(onChange)

    void load()

    return () => {
      active = false
      browser.storage.onChanged.removeListener(onChange)
    }
  }, [])

  return { error, library, loading }
}
