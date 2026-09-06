import { useEffect, useState } from 'preact/hooks'
import type { ContainerIdentity } from '@/data/browser/types'
import { getContainers } from '@/data/browser/browser-api'
import { useProxyLibrary } from '@/features/proxies/hooks/use-proxy-library'

/**
 * Follow the live identities assigned to a saved proxy.
 * @param proxyId - Saved proxy identifier.
 * @returns Assigned identities with loading and error state.
 */
export const useProxyContainers = (proxyId: string) => {
  const {
    library,
    loading: libraryLoading,
    error: libraryError,
  } = useProxyLibrary()

  const [identities, setIdentities] = useState<ContainerIdentity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const containers = await getContainers()

        if (active) {
          setIdentities(containers)
          setError('')
        }
      } catch {
        if (active) {
          setError('Could not load containers.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    const refresh = () => {
      void load()
    }

    const events = browser.contextualIdentities
    events.onCreated.addListener(refresh)
    events.onUpdated.addListener(refresh)
    events.onRemoved.addListener(refresh)

    void load()

    return () => {
      active = false
      events.onCreated.removeListener(refresh)
      events.onUpdated.removeListener(refresh)
      events.onRemoved.removeListener(refresh)
    }
  }, [])

  return {
    containers: identities.filter(
      (identity) => library.assignments[identity.cookieStoreId] === proxyId,
    ),
    error: error || libraryError,
    loading: loading || libraryLoading,
  }
}
