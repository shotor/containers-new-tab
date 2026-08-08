import { Button } from '@/components/button/button'
import { colorCodeFor } from '@/data/browser/browser-api'
import { CONTAINER_ICON_NAMES } from '@/data/browser/types'
import type { ContainerDetailFormValues } from '@/features/container-detail/container-detail.schema'
import css from './identity.module.css'
import detailCss from '@/features/container-detail/container-detail.module.css'
import { FieldError } from '@/features/container-detail/components/field-error'
import { Label } from '@/components/label/label'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

export type IconFieldProps = {
  color: ContainerDetailFormValues['color']
  icon: ContainerDetailFormValues['icon']
  error?: string
  onChange: (icon: ContainerDetailFormValues['icon']) => void
}

/**
 * Container icon radiogroup.
 * @param props - Current color/icon, optional error, and change handler.
 * @returns The rendered icon field.
 */
export const IconField: React.FC<IconFieldProps> = ({
  color,
  icon,
  error,
  onChange,
}) => (
  <div class={detailCss.field}>
    <Label id="detail-icon-label">Icon</Label>
    <div
      class={css.iconRow}
      role="radiogroup"
      aria-labelledby="detail-icon-label"
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? 'detail-icon-error' : undefined}
    >
      {CONTAINER_ICON_NAMES.map((i) => (
        <Button
          key={i}
          variant="plain"
          class={css.iconPick}
          role="radio"
          aria-checked={i === icon ? 'true' : 'false'}
          aria-label={i}
          title={i}
          style={{ '--pick-color': colorCodeFor(color) }}
          onClick={() => onChange(i)}
        >
          <SvgIcon name={i} class={css.iconGlyph} />
        </Button>
      ))}
    </div>
    <FieldError id="detail-icon-error" message={error} />
  </div>
)
