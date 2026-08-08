import * as z from 'zod/mini'
import {
  type ContainerDetailFormValues,
  identityPersistSchema,
} from '@/features/container-detail/container-detail.schema'
import { ColorField } from '@/features/container-detail/components/color-field'
import css from '@/features/container-detail/container-detail.module.css'
import { FieldError } from '@/features/container-detail/components/field-error'
import { IconField } from '@/features/container-detail/components/icon-field'
import { Input } from '@/components/input/input'
import { Label } from '@/components/label/label'
import type { UseFormRegister } from 'react-hook-form'
import { useState } from 'preact/hooks'

export type IdentityProps = {
  register: UseFormRegister<ContainerDetailFormValues>
  values: Pick<ContainerDetailFormValues, 'name' | 'color' | 'icon'>
  onColorChange: (color: ContainerDetailFormValues['color']) => void
  onIconChange: (icon: ContainerDetailFormValues['icon']) => void
}

/**
 * Identity form: name input, color swatches, icon picker.
 * @param props - Form register, watched values, and color/icon setters.
 * @returns The rendered form fields.
 */
export const Identity: React.FC<IdentityProps> = ({
  register,
  values,
  onColorChange,
  onIconChange,
}) => {
  const [nameTouched, setNameTouched] = useState(false)
  const nameRegister = register('name')
  const parsed = identityPersistSchema.safeParse({
    color: values.color,
    icon: values.icon,
    name: values.name,
  })
  const fieldErrors = parsed.success
    ? undefined
    : z.flattenError(parsed.error).fieldErrors
  const nameError = nameTouched ? fieldErrors?.name?.[0] : undefined

  return (
    <>
      <div class={css.field}>
        <Label for="detail-name">Name</Label>
        <Input
          id="detail-name"
          type="text"
          placeholder="Work, Shopping, …"
          aria-invalid={nameError ? 'true' : undefined}
          aria-describedby={nameError ? 'detail-name-error' : undefined}
          {...nameRegister}
          onBlur={(e) => {
            nameRegister.onBlur(e)
            setNameTouched(true)
          }}
        />
        <FieldError id="detail-name-error" message={nameError} />
      </div>

      <ColorField
        color={values.color}
        error={fieldErrors?.color?.[0]}
        onChange={onColorChange}
      />

      <IconField
        color={values.color}
        icon={values.icon}
        error={fieldErrors?.icon?.[0]}
        onChange={onIconChange}
      />
    </>
  )
}
