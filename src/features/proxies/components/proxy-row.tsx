import { Button, ButtonRow } from '@/components/button/button'
import { useEffect, useState } from 'preact/hooks'
import badgeCss from './proxy-type-badge.module.css'
import css from './proxy-row.module.css'
import cx from 'classnames'
import { ProxyContainers } from '@/features/proxies/components/proxy-containers'
import { ProxyDeleteDialog } from '@/features/proxies/components/proxy-delete-dialog'
import { ProxyFields } from '@/features/proxies/components/proxy-fields'
import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'
import { ProxyTypeBadge } from '@/features/proxies/components/proxy-type-badge'
import type { SavedProxy } from '@/data/types'

export type ProxyRowProps = {
  id: string
  proxy: SavedProxy
  usage: number
  isNew?: boolean
  /** False while the proxies page is hidden; collapses the editor. */
  active?: boolean
  onClose?: () => void
}

/**
 * A saved proxy with inline editing and delete confirmation.
 * @param props - Definition, assignment count, visibility and creation controls.
 * @returns The proxy row.
 */
export const ProxyRow: React.FC<ProxyRowProps> = ({
  id,
  proxy,
  usage,
  isNew = false,
  active = true,
  onClose,
}) => {
  const [editing, setEditing] = useState(isNew)
  const [draft, setDraft] = useState(proxy)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!active) {
      setEditing(false)
      setConfirmDelete(false)
      setError('')
    }
  }, [active])

  /**
   * Persist a change and keep failures visible alongside the row.
   * @param remove - Whether to delete instead of saving.
   */
  const persist = async (remove = false): Promise<void> => {
    setBusy(true)
    setError('')

    try {
      if (remove) {
        await proxyLibraryApi.remove(id)
      } else {
        await proxyLibraryApi.save(id, draft)
      }

      setEditing(false)
      setConfirmDelete(false)
      onClose?.()
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Could not save changes.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section class={css.root} aria-label={isNew ? 'New proxy' : proxy.name}>
      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void persist()
          }}
        >
          <fieldset class={css.fields} disabled={busy}>
            <ProxyFields value={draft} onChange={setDraft} />

            <ProxyContainers proxyId={id} />

            <ButtonRow class={css.formActions}>
              {!isNew && (
                <>
                  <Button
                    variant="danger"
                    disabled={busy}
                    onClick={() => {
                      setError('')
                      setConfirmDelete(true)
                    }}
                  >
                    Delete
                  </Button>
                  <span class={css.divider} aria-hidden="true" />
                </>
              )}

              <Button
                onClick={() => {
                  setEditing(false)
                  setError('')
                  onClose?.()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{busy ? 'Saving…' : 'Save'}</Button>
            </ButtonRow>
          </fieldset>
        </form>
      ) : (
        <div class={css.summary}>
          <button
            type="button"
            class={css.rowButton}
            aria-label={`Edit ${proxy.name}`}
            onClick={() => {
              setDraft(proxy)
              setEditing(true)
              setError('')
            }}
          >
            <span class={css.identity}>
              <strong>{proxy.name}</strong>
              <span class={css.address}>
                <ProxyTypeBadge type={proxy.type} />
                <span class={cx(badgeCss.root, badgeCss.neutral)}>
                  {proxy.host}:{proxy.port}
                </span>
              </span>
            </span>
            <span class={css.usage}>
              {usage} {usage === 1 ? 'container' : 'containers'}
            </span>
          </button>
          <div class={css.actions}>
            <Button
              variant="danger"
              disabled={busy}
              onClick={() => {
                setError('')
                setConfirmDelete(true)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ProxyDeleteDialog
          name={proxy.name}
          proxyId={id}
          busy={busy}
          error={error}
          onCancel={() => {
            setConfirmDelete(false)
            setError('')
          }}
          onConfirm={() => void persist(true)}
        />
      )}

      {Boolean(error) && !confirmDelete && <p role="alert">{error}</p>}
    </section>
  )
}
