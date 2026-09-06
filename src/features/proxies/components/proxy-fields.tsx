import { Input, Select } from '@/components/input/input'
import css from './proxy-fields.module.css'
import type { SavedProxy } from '@/data/types'
import { useId } from 'preact/hooks'

export type ProxyFieldsProps = {
  value: SavedProxy
  onChange: (value: SavedProxy) => void
}

/**
 * Inline fields for a reusable proxy definition.
 * @param props - Draft definition and change handler.
 * @returns Labelled proxy inputs.
 */
export const ProxyFields: React.FC<ProxyFieldsProps> = ({
  value,
  onChange,
}) => {
  const id = useId()

  return (
    <div class={css.root}>
      <label class={css.fullField} for={`${id}-name`}>
        Name
        <Input
          id={`${id}-name`}
          value={value.name}
          required
          onInput={(event) =>
            onChange({ ...value, name: event.currentTarget.value })
          }
        />
      </label>

      <label class={css.field} for={`${id}-type`}>
        Type
        <Select
          id={`${id}-type`}
          value={value.type}
          onChange={(event) => {
            const type = event.currentTarget.value

            if (
              type === 'http' ||
              type === 'https' ||
              type === 'socks' ||
              type === 'socks4'
            ) {
              onChange({ ...value, type })
            }
          }}
        >
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
          <option value="socks">SOCKS5</option>
          <option value="socks4">SOCKS4</option>
        </Select>
      </label>

      <label class={css.field} for={`${id}-host`}>
        Host
        <Input
          id={`${id}-host`}
          value={value.host}
          required
          onInput={(event) =>
            onChange({ ...value, host: event.currentTarget.value })
          }
        />
      </label>

      <label class={css.field} for={`${id}-port`}>
        Port
        <Input
          id={`${id}-port`}
          type="number"
          min={1}
          max={65535}
          step={1}
          required
          value={value.port || ''}
          onInput={(event) =>
            onChange({ ...value, port: Number(event.currentTarget.value) })
          }
        />
      </label>

      {(
        [
          ['username', 'Username (optional)'],
          ['password', 'Password (optional)'],
        ] as const
      ).map(([field, label]) => (
        <label class={css.fullField} key={field} for={`${id}-${field}`}>
          {label}
          <Input
            id={`${id}-${field}`}
            type={field === 'password' ? 'password' : 'text'}
            value={value[field] ?? ''}
            autocomplete={field === 'password' ? 'new-password' : 'off'}
            onInput={(event) =>
              onChange({ ...value, [field]: event.currentTarget.value })
            }
          />
        </label>
      ))}

      <label class={css.bypass}>
        <input
          class={css.switch}
          type="checkbox"
          role="switch"
          checked={value.doNotProxyLocal}
          onChange={(event) =>
            onChange({ ...value, doNotProxyLocal: event.currentTarget.checked })
          }
        />
        Don’t proxy localhost
      </label>
    </div>
  )
}
