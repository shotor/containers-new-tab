import { useEffect, useId, useLayoutEffect, useRef } from 'preact/hooks'
import { Button } from '@/components/button/button'
import { colorCodeFor } from '@/data/browser/browser-api'
import type { ComponentChildren } from 'preact'
import css from './delete-confirm-dialog.module.css'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

export type DeleteConfirmDialogProps = {
  name: string
  description: string
  children?: ComponentChildren
  confirmDisabled?: boolean
  color?: string
  icon?: string
  busy?: boolean
  error?: string
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Shared confirmation dialog for permanent deletion.
 * @param props - Description, optional preview, pending state and callbacks.
 * @returns The rendered dialog.
 */
export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  name,
  description,
  children,
  confirmDisabled = false,
  color,
  icon,
  busy = false,
  error = '',
  onCancel,
  onConfirm,
}) => {
  const id = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef(onCancel)
  const busyRef = useRef(busy)
  useLayoutEffect(() => {
    cancelRef.current = onCancel
    busyRef.current = busy
  }, [onCancel, busy])

  useEffect(() => {
    const previous = document.activeElement
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()

        if (!busyRef.current) {
          cancelRef.current()
        }
      }

      if (event.key === 'Tab') {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
          'button:not(:disabled)',
        )
        const first = buttons?.[0]
        const last = buttons?.[buttons.length - 1]

        if (!first || !last) {
          event.preventDefault()
          return
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)

      if (previous instanceof HTMLElement && previous.isConnected) {
        previous.focus()
      }
    }
  }, [])

  return (
    <div
      class={css.root}
      role="presentation"
      onClick={() => {
        if (!busy) {
          onCancel()
        }
      }}
    >
      <div
        ref={dialogRef}
        class={css.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <span
            class={css.iconBadge}
            style={{
              '--title-color': color ? colorCodeFor(color) : 'var(--danger)',
            }}
          >
            <SvgIcon name={icon} class={css.icon} />
          </span>
        )}

        <h2 id={`${id}-title`} class={css.title}>
          Delete {name}?
        </h2>

        <p id={`${id}-desc`} class={css.desc}>
          {description}
        </p>

        {children}

        {Boolean(error) && (
          <p role="alert" class={css.error}>
            {error}
          </p>
        )}

        <div class={css.actions}>
          <Button
            variant="ghost"
            class={css.action}
            disabled={busy}
            onClick={() => {
              if (!busy) {
                onCancel()
              }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            class={css.action}
            disabled={busy || confirmDisabled}
            onClick={onConfirm}
          >
            {busy ? 'Deleting…' : 'Delete permanently'}
          </Button>
        </div>
      </div>
    </div>
  )
}
