import '@/data/zod-config'
import * as z from 'zod/mini'
import {
  CONTAINER_COLOR_NAMES,
  CONTAINER_ICON_NAMES,
} from '@/data/browser/types'
import { type ContainerProxy, PROXY_TYPES } from '@/data/types'

/** Proxy type values accepted by the detail form. */
const proxyTypeSchema = z.enum(PROXY_TYPES)

/** Container color names accepted by the detail form. */
const containerColorSchema = z.enum(CONTAINER_COLOR_NAMES)

/** Container icon names accepted by the detail form. */
const containerIconSchema = z.enum(CONTAINER_ICON_NAMES)

/**
 * Flat container detail form values (identity + proxy inputs).
 * Source of truth for shape; TypeScript type is inferred below.
 */
export const containerDetailFormSchema = z.object({
  color: containerColorSchema,
  doNotProxyLocal: z.boolean(),
  host: z.string(),
  icon: containerIconSchema,
  name: z.string(),
  password: z.string(),
  port: z.string(),
  type: proxyTypeSchema,
  username: z.string(),
})

/** Flat detail form values, inferred from Zod. */
export type ContainerDetailFormValues = z.infer<
  typeof containerDetailFormSchema
>

/** Proxy input fields on the detail form. */
export type ProxyFormValues = Pick<
  ContainerDetailFormValues,
  'type' | 'host' | 'port' | 'username' | 'password' | 'doNotProxyLocal'
>

/** Identity fields ready to create or update a container. */
export const identityPersistSchema = z.object({
  color: containerColorSchema,
  icon: containerIconSchema,
  name: z
    .string()
    .check(z.trim(), z.minLength(1, { error: 'Name is required' })),
})

/** Port string that is an integer in 1024…65535 (non-privileged on Linux). */
const proxyPortSchema = z.string().check(
  z.trim(),
  z.regex(/^\d+$/, { error: 'Port must be a number' }),
  z.refine(
    (value) => {
      const port = Number(value)

      return port >= 1024 && port <= 65535
    },
    { error: 'Port must be between 1024 and 65535' },
  ),
)

/**
 * Proxy form values ready to write to storage.
 * Parses to `null` for direct, or a {@link ContainerProxy} when complete.
 */
export const proxyPersistSchema = z.pipe(
  z.discriminatedUnion('type', [
    z.object({
      doNotProxyLocal: z.boolean(),
      host: z.string(),
      password: z.string(),
      port: z.string(),
      type: z.literal('direct'),
      username: z.string(),
    }),
    z.object({
      doNotProxyLocal: z.boolean(),
      host: z
        .string()
        .check(z.trim(), z.minLength(1, { error: 'Host is required' })),
      password: z.string(),
      port: proxyPortSchema,
      type: z.enum(['http', 'https', 'socks', 'socks4']),
      username: z.string(),
    }),
  ]),
  z.transform((data): ContainerProxy | null => {
    if (data.type === 'direct') {
      return null
    }

    return {
      doNotProxyLocal: data.doNotProxyLocal,
      host: data.host.trim(),
      password: data.password || undefined,
      port: Number(data.port),
      type: data.type,
      username: data.username.trim() || undefined,
    }
  }),
)

/**
 * Map a stored proxy (or none) onto proxy form fields.
 * @param existing - Stored proxy config, or null.
 * @returns Proxy fields for the detail form.
 */
export const proxyFormValuesFromStored = (
  existing: ContainerProxy | null,
): ProxyFormValues => ({
  doNotProxyLocal: existing?.doNotProxyLocal ?? true,
  host: existing?.host ?? '',
  password: existing?.password ?? '',
  port: existing?.port?.toString() ?? '',
  type: existing?.type ?? 'direct',
  username: existing?.username ?? '',
})

/** Default form values for a new container. */
export const DEFAULT_CONTAINER_DETAIL_FORM: ContainerDetailFormValues =
  containerDetailFormSchema.parse({
    color: 'blue',
    icon: 'fingerprint',
    name: '',
    ...proxyFormValuesFromStored(null),
  })
