import { act } from 'preact/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog/delete-confirm-dialog'

import { renderSnapshot } from '@/test/render-snapshot'

describe('DeleteConfirmDialog', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <DeleteConfirmDialog
          description="This permanently deletes the container and its cookie jar — logins and site data for this identity. This cannot be undone."
          name="Work"
          color="blue"
          icon="briefcase"
          onCancel={() => undefined}
          onConfirm={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('focuses Cancel, traps keyboard focus, and handles Escape', () => {
    const cancel = vi.fn<() => void>()
    const root = renderSnapshot(
      <DeleteConfirmDialog
        name="Office"
        description="Delete this saved proxy."
        onCancel={cancel}
        onConfirm={() => undefined}
      />,
    )
    const buttons = root.querySelectorAll('button')
    expect(document.activeElement).toBe(buttons[0])
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Tab',
          shiftKey: true,
        }),
      )
    })
    expect(document.activeElement).toBe(buttons[1])
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
      )
    })
    expect(cancel).toHaveBeenCalledOnce()
  })

  it('disables actions and ignores Escape while deletion is pending', () => {
    const cancel = vi.fn<() => void>()
    const root = renderSnapshot(
      <DeleteConfirmDialog
        name="Office"
        description="Delete this saved proxy."
        busy
        onCancel={cancel}
        onConfirm={() => undefined}
      />,
    )
    expect(root.querySelectorAll('button:disabled')).toHaveLength(2)
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
      )
    })
    expect(cancel).not.toHaveBeenCalled()
  })
})
