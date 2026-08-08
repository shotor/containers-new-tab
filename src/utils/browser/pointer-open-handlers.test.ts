import { describe, expect, it, vi } from 'vitest'
import { pointerOpenHandlers } from '@/utils/browser/pointer-open-handlers'

const event = (partial: {
  button?: number
  ctrlKey?: boolean
  metaKey?: boolean
}) =>
  ({
    button: 0,
    ctrlKey: false,
    metaKey: false,
    preventDefault: vi.fn<() => void>(),
    stopPropagation: vi.fn<() => void>(),
    ...partial,
  }) as unknown as Parameters<
    ReturnType<typeof pointerOpenHandlers>['onClick']
  >[0]

describe('pointerOpenHandlers', () => {
  it('opens in place on a plain click', () => {
    const open = vi.fn<(beside: boolean) => void>()
    const handlers = pointerOpenHandlers(open)
    handlers.onClick(event({}))
    expect(open).toHaveBeenCalledWith(false)
  })

  it('opens beside on ctrl-click and middle-click', () => {
    const open = vi.fn<(beside: boolean) => void>()
    const handlers = pointerOpenHandlers(open)

    const ctrl = event({ ctrlKey: true })
    handlers.onClick(ctrl)
    expect(open).toHaveBeenCalledWith(true)
    expect(ctrl.preventDefault).toHaveBeenCalled()

    open.mockClear()
    handlers.onAuxClick(event({ button: 1 }))
    expect(open).toHaveBeenCalledWith(true)
  })

  it('prevents middle-click autoscroll on mousedown', () => {
    const handlers = pointerOpenHandlers(() => undefined)
    const middle = event({ button: 1 })
    handlers.onMouseDown(middle)
    expect(middle.preventDefault).toHaveBeenCalled()
  })
})
