import {
  type ContainerDetailFormValues,
  type ProxyFormValues,
  proxyPersistSchema,
} from '@/features/container-detail/container-detail.schema'
import { Input, Select } from '@/components/input/input'
import css from '@/features/container-detail/container-detail.module.css'
import { FieldError } from '@/features/container-detail/components/field-error'
import { Label } from '@/components/label/label'
import { Notice } from '@/components/notice/notice'
import { PROXY_TYPES } from '@/data/types'
import { ProxyOptionalFields } from '@/features/container-detail/components/proxy-optional-fields'
import type { UseFormRegister } from 'react-hook-form'
import { useState } from 'preact/hooks'
import { z } from 'zod'

export type ProxyProps = {
  register: UseFormRegister<ContainerDetailFormValues>
  values: ContainerDetailFormValues
}

/**
 * Pick proxy fields from the watched detail form values.
 * @param values - Full form values.
 * @returns Proxy-only slice for validation.
 */
const proxySlice = (values: ContainerDetailFormValues): ProxyFormValues => ({
  doNotProxyLocal: values.doNotProxyLocal,
  host: values.host,
  password: values.password,
  port: values.port,
  type: values.type,
  username: values.username,
})

/**
 * Per-container proxy form fields.
 * @param props - Form register and watched values.
 * @returns The rendered form fields.
 */
export const Proxy: React.FC<ProxyProps> = ({ register, values }) => {
  const [touched, setTouched] = useState({
    host: false,
    port: false,
    type: false,
  })

  const draft = proxySlice(values)
  const typeRegister = register('type')
  const hostRegister = register('host')
  const portRegister = register('port')
  const parsed = proxyPersistSchema.safeParse(draft)
  const fieldErrors = parsed.success
    ? undefined
    : z.flattenError(parsed.error).fieldErrors
  const typeError = touched.type ? fieldErrors?.type?.[0] : undefined
  const hostError =
    draft.type !== 'direct' &&
    (touched.host || draft.host.length > 0 || touched.type)
      ? fieldErrors?.host?.[0]
      : undefined
  const portError =
    draft.type !== 'direct' &&
    (touched.port || draft.port.length > 0 || touched.type)
      ? fieldErrors?.port?.[0]
      : undefined

  return (
    <>
      <Notice variant="warning">
        This is separate from the proxy config in Multi-Account Containers.
        Other extensions can’t change MAC’s proxy settings, so anything you set
        here will still work, but must then be managed from here exclusively.
      </Notice>

      <div class={css.field}>
        <Label for="detail-proxy-type">Type</Label>
        <Select
          id="detail-proxy-type"
          aria-invalid={typeError ? 'true' : undefined}
          aria-describedby={typeError ? 'detail-proxy-type-error' : undefined}
          {...typeRegister}
          onChange={(e) => {
            setTouched((prev) => ({ ...prev, type: true }))
            void typeRegister.onChange(e)
          }}
          onBlur={(e) => {
            setTouched((prev) => ({ ...prev, type: true }))
            typeRegister.onBlur(e)
          }}
        >
          {PROXY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === 'direct' ? 'No proxy (direct)' : t}
            </option>
          ))}
        </Select>
        <FieldError id="detail-proxy-type-error" message={typeError} />
      </div>

      <div class={css.field}>
        <Label for="detail-proxy-host">Host</Label>
        <Input
          id="detail-proxy-host"
          type="text"
          aria-invalid={hostError ? 'true' : undefined}
          aria-describedby={hostError ? 'detail-proxy-host-error' : undefined}
          {...hostRegister}
          onBlur={(e) => {
            setTouched((prev) => ({ ...prev, host: true }))
            hostRegister.onBlur(e)
          }}
        />
        <FieldError id="detail-proxy-host-error" message={hostError} />
      </div>

      <div class={css.field}>
        <Label for="detail-proxy-port">Port</Label>
        <Input
          id="detail-proxy-port"
          type="number"
          min={1024}
          max={65535}
          aria-invalid={portError ? 'true' : undefined}
          aria-describedby={portError ? 'detail-proxy-port-error' : undefined}
          {...portRegister}
          onBlur={(e) => {
            setTouched((prev) => ({ ...prev, port: true }))
            portRegister.onBlur(e)
          }}
        />
        <FieldError id="detail-proxy-port-error" message={portError} />
      </div>

      <ProxyOptionalFields register={register} />
    </>
  )
}
