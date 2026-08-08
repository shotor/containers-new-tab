import type { RefObject } from 'preact'
import { useEffect } from 'preact/hooks'

/**
 * While open, close on outside pointerdown or Escape.
 * @param open - Whether the floating UI is open.
 * @param rootRef - Element treated as inside (trigger + panel).
 * @param setOpen - Open-state setter; called with `false` to dismiss.
 */
export const useDismissOnOutsideOrEscape = (
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  setOpen: (open: boolean) => void,
): void => {
  useEffect(() => {
    if (!open) {
      return
    }

    const onPointer = (e: PointerEvent) => {
      // EventTarget is not always a Node (e.g. text nodes / window).
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, rootRef, setOpen])
}
