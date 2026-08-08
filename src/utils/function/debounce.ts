/**
 * Debounced wrapper around a function, with cancel support.
 */
export type Debounced<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void
}

/**
 * Return a function that delays invoking `fn` until `waitMs` after the last call.
 * @param fn - Function to invoke after the quiet period.
 * @param waitMs - Delay in milliseconds.
 * @returns Debounced function with a `.cancel()` method.
 */
export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): Debounced<Args> => {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: Args) => {
    if (timer != null) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = null
      fn(...args)
    }, waitMs)
  }) as Debounced<Args>

  debounced.cancel = () => {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced
}
