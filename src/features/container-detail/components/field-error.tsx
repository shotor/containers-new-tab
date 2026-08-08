import css from '@/features/container-detail/container-detail.module.css'

export type FieldErrorProps = {
  id?: string
  message?: string
}

/**
 * Inline validation message under a form field.
 * @param props - Optional element id and error message (hidden when empty).
 * @returns The rendered error, or null when there is no message.
 */
export const FieldError: React.FC<FieldErrorProps> = ({ id, message }) => {
  if (!message) {
    return null
  }

  return (
    <p id={id} class={css.error} role="alert">
      {message}
    </p>
  )
}
