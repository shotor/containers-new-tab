import { Button } from '@/components/button/button'
import { colorCodeFor } from '@/data/browser/browser-api'
import { CONTAINER_COLOR_NAMES } from '@/data/browser/types'
import type { ContainerDetailFormValues } from '@/features/container-detail/container-detail.schema'
import css from './identity.module.css'
import detailCss from '@/features/container-detail/container-detail.module.css'
import { FieldError } from '@/features/container-detail/components/field-error'
import { Label } from '@/components/label/label'

export type ColorFieldProps = {
  color: ContainerDetailFormValues['color']
  error?: string
  onChange: (color: ContainerDetailFormValues['color']) => void
}

/**
 * Container color swatch radiogroup.
 * @param props - Current color, optional error, and change handler.
 * @returns The rendered color field.
 */
export const ColorField: React.FC<ColorFieldProps> = ({
  color,
  error,
  onChange,
}) => (
  <div class={detailCss.field}>
    <Label id="detail-color-label">Color</Label>
    <div
      class={css.swatchRow}
      role="radiogroup"
      aria-labelledby="detail-color-label"
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? 'detail-color-error' : undefined}
    >
      {CONTAINER_COLOR_NAMES.map((c) => (
        <Button
          key={c}
          variant="plain"
          class={css.swatch}
          role="radio"
          aria-checked={c === color ? 'true' : 'false'}
          aria-label={c}
          title={c}
          style={{ '--swatch': colorCodeFor(c) }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
    <FieldError id="detail-color-error" message={error} />
  </div>
)
