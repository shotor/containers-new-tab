import '@/data/zod-config'
import * as z from 'zod/mini'
import {
  CONTAINER_COLOR_NAMES,
  CONTAINER_ICON_NAMES,
} from '@/data/browser/types'

/** Container color names accepted by the detail form. */
const containerColorSchema = z.enum(CONTAINER_COLOR_NAMES)

/** Container icon names accepted by the detail form. */
const containerIconSchema = z.enum(CONTAINER_ICON_NAMES)

/**
 * Container identity form values.
 * Source of truth for shape; TypeScript type is inferred below.
 */
export const containerDetailFormSchema = z.object({
  color: containerColorSchema,
  icon: containerIconSchema,
  name: z.string(),
})

/** Flat detail form values, inferred from Zod. */
export type ContainerDetailFormValues = z.infer<
  typeof containerDetailFormSchema
>

/** Identity fields ready to create or update a container. */
export const identityPersistSchema = z.object({
  color: containerColorSchema,
  icon: containerIconSchema,
  name: z
    .string()
    .check(z.trim(), z.minLength(1, { error: 'Name is required' })),
})

/** Default form values for a new container. */
export const DEFAULT_CONTAINER_DETAIL_FORM: ContainerDetailFormValues =
  containerDetailFormSchema.parse({
    color: 'blue',
    icon: 'fingerprint',
    name: '',
  })
