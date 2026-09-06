import { act } from 'preact/test-utils'
import { describe, expect, it, vi } from 'vitest'

import type { ContainerIdentity } from '@/data/browser/types'

import { ShortcutForm } from '@/features/shortcuts/components/shortcut-form'

import { click, renderSnapshot, typeInput } from '@/test/render-snapshot'

const containers = [
  { cookieStoreId: 'firefox-container-1', name: 'Work' },
] as ContainerIdentity[]

describe('ShortcutForm', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <ShortcutForm
          containers={containers}
          onSave={() => undefined}
          onCancel={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('submits the address with the chosen container, and cancels', () => {
    const onSave = vi.fn()
    const onCancel = vi.fn()
    const root = renderSnapshot(
      <ShortcutForm
        containers={containers}
        onSave={onSave}
        onCancel={onCancel}
      />,
    )
    typeInput(root.querySelector('input')!, 'github.com')
    const select = root.querySelector('select')!
    act(() => {
      select.value = 'firefox-container-1'
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })
    act(() => {
      root
        .querySelector('form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(onSave).toHaveBeenCalledWith({
      cookieStoreId: 'firefox-container-1',
      url: 'github.com',
    })

    click(root.querySelectorAll('button')[0])
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows the error and disables fields while busy', () => {
    const root = renderSnapshot(
      <ShortcutForm
        containers={containers}
        busy
        error="This website is already a shortcut."
        onSave={() => undefined}
        onCancel={() => undefined}
      />,
    )
    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'already a shortcut',
    )
    expect(root.querySelector('fieldset')?.disabled).toBe(true)
    expect(root.textContent).toContain('Saving…')
  })

  it('prefills when editing and labels the submit as Save', () => {
    const root = renderSnapshot(
      <ShortcutForm
        containers={containers}
        initial={{
          cookieStoreId: 'firefox-container-1',
          url: 'https://github.com',
        }}
        onSave={() => undefined}
        onCancel={() => undefined}
      />,
    )
    expect(root.querySelector('input')?.value).toBe('https://github.com')
    expect(root.querySelector('select')?.value).toBe('firefox-container-1')
    expect(root.querySelector('form')?.getAttribute('aria-label')).toBe(
      'Edit shortcut',
    )
    expect(root.textContent).toContain('Save')
    expect(root.textContent).not.toContain('Delete')
  })

  it('offers Delete with a divider when editing', () => {
    const onDelete = vi.fn()
    const root = renderSnapshot(
      <ShortcutForm
        containers={containers}
        initial={{ cookieStoreId: 'firefox-default', url: 'https://a.example' }}
        onSave={() => undefined}
        onCancel={() => undefined}
        onDelete={onDelete}
      />,
    )
    const buttons = [...root.querySelectorAll('button')]
    expect(buttons.map((b) => b.textContent)).toEqual([
      'Delete',
      'Cancel',
      'Save',
    ])
    expect(root.querySelector('[class*="divider"]')).not.toBeNull()
    click(buttons[0])
    expect(onDelete).toHaveBeenCalledOnce()
  })
})
