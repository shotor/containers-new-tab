import { Button } from '@/components/button/button'
import css from '@/features/container-detail/container-detail.module.css'
import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'
import { Select } from '@/components/input/input'
import { useProxyLibrary } from '@/features/proxies/hooks/use-proxy-library'
import { useState } from 'preact/hooks'

export type ProxyProps = {
  cookieStoreId?: string
}

/**
 * Assign a saved proxy to this container.
 * @param props - The persisted container identifier.
 * @returns A proxy selector and a button to manage definitions.
 */
export const Proxy: React.FC<ProxyProps> = ({ cookieStoreId }) => {
  const { library, loading, error } = useProxyLibrary()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  /**
   * Persist selection while leaving the previous assignment intact on failure.
   * @param id - Selected definition, or empty for direct access.
   */
  const select = async (id: string): Promise<void> => {
    if (!cookieStoreId) {
      return
    }

    setSaving(true)
    setSaveError('')

    try {
      await proxyLibraryApi.assign(cookieStoreId, id)
    } catch {
      setSaveError('Could not save the proxy selection. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div class={css.field}>
      <label for="container-proxy">Saved proxy</label>
      <Select
        id="container-proxy"
        disabled={loading || saving || !cookieStoreId || Boolean(error)}
        value={cookieStoreId ? (library.assignments[cookieStoreId] ?? '') : ''}
        onChange={(event) => void select(event.currentTarget.value)}
      >
        <option value="">No proxy (direct)</option>
        {Object.entries(library.proxies).map(([id, proxy]) => (
          <option key={id} value={id}>
            {`${proxy.name} - ${proxy.host}:${proxy.port}`}
          </option>
        ))}
      </Select>
      {!cookieStoreId && <p>Name the container first to select a proxy.</p>}
      {saving && <span role="status">Saving…</span>}
      {Boolean(error || saveError) && <p role="alert">{error || saveError}</p>}
      <Button
        variant="ghost"
        class={css.fieldAction}
        onClick={() => {
          window.location.hash = '/proxies'
        }}
      >
        Manage proxies
      </Button>
    </div>
  )
}
