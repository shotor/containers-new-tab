import type { ContainerDetailFormValues } from '@/features/container-detail/container-detail.schema'
import css from '@/features/container-detail/container-detail.module.css'
import { Input } from '@/components/input/input'
import { Label } from '@/components/label/label'
import type { UseFormRegister } from 'react-hook-form'

export type ProxyOptionalFieldsProps = {
  register: UseFormRegister<ContainerDetailFormValues>
}

/**
 * Optional proxy auth fields and localhost bypass checkbox.
 * @param props - Form register from the parent proxy form.
 * @returns The rendered optional fields.
 */
export const ProxyOptionalFields: React.FC<ProxyOptionalFieldsProps> = ({
  register,
}) => (
  <>
    <div class={css.field}>
      <Label for="detail-proxy-user">Username (optional)</Label>
      <Input
        id="detail-proxy-user"
        type="text"
        autocomplete="off"
        {...register('username')}
      />
    </div>

    <div class={css.field}>
      <Label for="detail-proxy-pass">Password (optional)</Label>
      <Input
        id="detail-proxy-pass"
        type="password"
        autocomplete="new-password"
        {...register('password')}
      />
    </div>

    <div class={css.field}>
      <Label>
        <input type="checkbox" {...register('doNotProxyLocal')} /> Don’t proxy
        localhost
      </Label>
    </div>
  </>
)
