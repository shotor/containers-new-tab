import { useId, useState } from 'preact/hooks'

import { Button, ButtonRow } from '@/components/button/button'
import { Input, Select } from '@/components/input/input'

import {
  type ContainerIdentity,
  DEFAULT_COOKIE_STORE,
} from '@/data/browser/types'
import type { NewShortcut } from '@/data/shortcuts/shortcuts-api'

import css from './shortcut-form.module.css'

export type ShortcutFormProps = {
  containers: ContainerIdentity[]
  /** Existing values when editing; omitted for a new shortcut. */
  initial?: Required<NewShortcut>
  busy?: boolean
  error?: string
  onSave: (input: Required<NewShortcut>) => void
  onCancel: () => void
  /** When editing, offers deletion next to the other actions. */
  onDelete?: () => void
}

/**
 * Inline form to add or edit a website shortcut and the container it opens in.
 * @param props - Container choices, pending state, error and callbacks.
 * @returns The rendered form.
 */
export const ShortcutForm: React.FC<ShortcutFormProps> = ({
  containers,
  initial,
  busy = false,
  error = '',
  onSave,
  onCancel,
  onDelete,
}) => {
  const id = useId()
  const [url, setUrl] = useState(initial?.url ?? '')
  const [cookieStoreId, setCookieStoreId] = useState(
    initial?.cookieStoreId ?? DEFAULT_COOKIE_STORE,
  )
  const editing = initial !== undefined

  return (
    <form
      class={css.root}
      aria-label={editing ? 'Edit shortcut' : 'New shortcut'}
      onSubmit={(event) => {
        event.preventDefault()
        onSave({ cookieStoreId, url })
      }}
    >
      <fieldset class={css.fields} disabled={busy}>
        <label class={css.site} for={`${id}-url`}>
          Website
          <Input
            id={`${id}-url`}
            type="text"
            inputMode="url"
            autocomplete="off"
            placeholder="example.com"
            value={url}
            required
            autofocus
            onInput={(event) => setUrl(event.currentTarget.value)}
          />
        </label>

        <label class={css.container} for={`${id}-container`}>
          Open in
          <Select
            id={`${id}-container`}
            value={cookieStoreId}
            onChange={(event) => setCookieStoreId(event.currentTarget.value)}
          >
            <option value={DEFAULT_COOKIE_STORE}>No container</option>
            {containers.map((container) => (
              <option
                key={container.cookieStoreId}
                value={container.cookieStoreId}
              >
                {container.name}
              </option>
            ))}
          </Select>
        </label>

        {Boolean(error) && (
          <p role="alert" class={css.error}>
            {error}
          </p>
        )}

        <ButtonRow class={css.actions}>
          {onDelete && (
            <>
              <Button variant="danger" disabled={busy} onClick={onDelete}>
                Delete
              </Button>
              <span class={css.divider} aria-hidden="true" />
            </>
          )}

          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit">
            {busy ? 'Saving…' : editing ? 'Save' : 'Add shortcut'}
          </Button>
        </ButtonRow>
      </fieldset>
    </form>
  )
}
