import { Badge } from '@/components/badge/badge'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog/delete-confirm-dialog'

import { useProxyContainers } from '@/features/proxies/hooks/use-proxy-containers'

import css from './proxy-delete-dialog.module.css'

export type ProxyDeleteDialogProps = {
  proxyId: string
  name: string
  busy: boolean
  error: string
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Confirm proxy deletion with the affected containers and connection changes.
 * @param props - Proxy identity and deletion state/actions.
 * @returns The shared deletion dialog with assignment details.
 */
export const ProxyDeleteDialog: React.FC<ProxyDeleteDialogProps> = ({
  proxyId,
  name,
  busy,
  error,
  onCancel,
  onConfirm,
}) => {
  const { containers, loading, error: loadError } = useProxyContainers(proxyId)

  return (
    <DeleteConfirmDialog
      name={name}
      description="This permanently deletes the saved proxy. Its assignments will be removed from the containers below, which will then connect directly. The containers will not be deleted."
      busy={busy}
      confirmDisabled={loading || Boolean(loadError)}
      error={error || loadError}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      {loading ? (
        <p class={css.message}>Loading affected containers…</p>
      ) : containers.length ? (
        <ul class={css.list} aria-label="Affected containers">
          {containers.map((container) => (
            <li key={container.cookieStoreId}>
              <Badge
                label={container.name}
                color={container.colorCode}
                icon={container.icon}
              />
            </li>
          ))}
        </ul>
      ) : (
        !loadError && (
          <p class={css.message}>No containers currently use this proxy.</p>
        )
      )}
    </DeleteConfirmDialog>
  )
}
