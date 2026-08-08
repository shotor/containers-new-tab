import { describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import { renderHook } from '@/test/render-hook'
import { useDismissOnOutsideOrEscape } from '@/utils/dom/use-dismiss-on-outside-or-escape'
import { useRef } from 'preact/hooks'

describe('useDismissOnOutsideOrEscape', () => {
  it('closes on outside pointerdown and Escape while open', () => {
    const setOpen = vi.fn<(open: boolean) => void>()
    const root = document.createElement('div')
    document.body.appendChild(root)

    const { unmount } = renderHook(() => {
      const rootRef = useRef<HTMLElement | null>(root)
      useDismissOnOutsideOrEscape(true, rootRef, setOpen)
    })

    act(() => {
      window.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })
    expect(setOpen).toHaveBeenCalledWith(false)

    setOpen.mockClear()
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    expect(setOpen).toHaveBeenCalledWith(false)

    unmount()
    root.remove()
  })

  it('does not listen while closed', () => {
    const setOpen = vi.fn<(open: boolean) => void>()
    renderHook(() => {
      const rootRef = useRef<HTMLElement | null>(null)
      useDismissOnOutsideOrEscape(false, rootRef, setOpen)
    })

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    expect(setOpen).not.toHaveBeenCalled()
  })
})
