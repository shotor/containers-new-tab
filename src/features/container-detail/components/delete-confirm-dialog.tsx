import { Button } from '@/components/button/button'
import { colorCodeFor } from '@/data/browser/browser-api'
import css from './delete-confirm-dialog.module.css'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

export type DeleteConfirmDialogProps = {
  name: string
  color: string
  icon: string
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Hard-confirm dialog before permanently deleting a container.
 * @param props - Identity preview and cancel/confirm callbacks.
 * @returns The rendered dialog.
 */
export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  name,
  color,
  icon,
  onCancel,
  onConfirm,
}) => (
  <div class={css.root} role="presentation" onClick={onCancel}>
    <div
      class={css.dialog}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
      onClick={(e) => e.stopPropagation()}
    >
      <SvgIcon
        name={icon}
        class={css.icon}
        style={{ '--title-color': colorCodeFor(color) }}
      />

      <h2 id="delete-dialog-title" class={css.title}>
        Delete {name}?
      </h2>

      <p id="delete-dialog-desc" class={css.desc}>
        This permanently deletes the container and its cookie jar — logins and
        site data for this identity. This cannot be undone.
      </p>

      <div class={css.actions}>
        <Button variant="ghost" class={css.action} onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="danger" class={css.action} onClick={onConfirm}>
          Delete permanently
        </Button>
      </div>
    </div>
  </div>
)
