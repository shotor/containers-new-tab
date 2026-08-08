import { type ComponentChildren, render } from 'preact'
import { act } from 'preact/test-utils'

/**
 * Mount a hook inside a host component for unit tests.
 * @param useHook - Hook factory invoked each render.
 * @returns Current hook result plus rerender/unmount helpers.
 */
export const renderHook = <T,>(useHook: () => T) => {
  const result: { current: T | undefined } = { current: undefined }

  const Host = (): ComponentChildren => {
    result.current = useHook()
    return null
  }

  const container = document.createElement('div')
  document.body.appendChild(container)

  const paint = () => {
    act(() => {
      render(<Host />, container)
    })
  }

  paint()

  return {
    rerender: paint,
    result: result as { current: T },
    unmount: () => {
      act(() => {
        render(null, container)
      })
      container.remove()
    },
  }
}
