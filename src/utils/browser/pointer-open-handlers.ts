import type { TargetedMouseEvent } from 'preact'

/**
 * Whether a click should open beside the current tab (middle-click or ctrl/cmd).
 * @param e - The mouse event.
 * @returns True when the user asked to open beside.
 */
const isOpenBeside = (e: {
  button?: number
  ctrlKey: boolean
  metaKey: boolean
}): boolean => e.button === 1 || e.ctrlKey || e.metaKey

/** Click / aux-click / mouse-down handler trio for open-link buttons. */
type PointerOpenHandlers = {
  onClick: (e: TargetedMouseEvent<HTMLButtonElement>) => void
  onAuxClick: (e: TargetedMouseEvent<HTMLButtonElement>) => void
  onMouseDown: (e: TargetedMouseEvent<HTMLButtonElement>) => void
}

/**
 * Build the pointer handler trio for a button that opens a link.
 * Plain click opens in place; middle-click or ctrl/cmd-click opens beside.
 * @param open - Called with whether to open beside the current tab.
 * @returns The handler trio to spread onto a button.
 */
export const pointerOpenHandlers = (
  open: (beside: boolean) => void,
): PointerOpenHandlers => ({
  onAuxClick: (e) => {
    if (e.button !== 1) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    open(true)
  },
  onClick: (e) => {
    const beside = isOpenBeside(e)
    if (beside) {
      e.preventDefault()
      e.stopPropagation()
    }
    open(beside)
  },
  onMouseDown: (e) => {
    // Avoid middle-click autoscroll; keep modifiers for the click.
    if (e.button === 1) {
      e.preventDefault()
    }
  },
})
