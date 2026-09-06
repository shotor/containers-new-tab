import { act } from 'preact/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SitesPanel } from '@/features/site-assignments/sites-panel'

import { openContainerTab } from '@/utils/browser/open-container-tab'

import {
  click,
  renderSnapshot,
  renderTo,
  typeInput,
} from '@/test/render-snapshot'

const { add, remove, update, state } = vi.hoisted(() => ({
  add: vi.fn(async () => undefined),
  remove: vi.fn(async () => undefined),
  state: {
    shortcuts: [
      {
        cookieStoreId: 'firefox-default',
        id: 's1',
        url: 'https://news.ycombinator.com',
      },
      {
        cookieStoreId: 'firefox-container-1',
        id: 's2',
        url: 'https://github.com/notifications',
      },
    ],
  },
  update: vi.fn(async () => undefined),
}))
const allShortcuts = [...state.shortcuts]

vi.mock('@/features/container-grid/hooks/use-sorted-containers', () => ({
  useSortedContainers: () => ({
    containers: [
      {
        color: 'blue',
        colorCode: '#00f',
        cookieStoreId: 'firefox-container-1',
        icon: 'briefcase',
        name: 'Work',
      },
    ],
  }),
}))

vi.mock('@/features/shortcuts/hooks/use-shortcuts', () => ({
  useShortcuts: () => ({
    add,
    loading: false,
    remove,
    shortcuts: state.shortcuts,
    update,
  }),
}))

vi.mock('@/features/site-assignments/hooks/use-assigned-sites', () => ({
  useAssignedSites: () => ({
    loading: false,
    sites: [
      {
        cookieStoreId: 'firefox-container-1',
        host: 'github.com',
        url: 'https://github.com',
      },
    ],
  }),
}))

vi.mock('@/data/browser/browser-api', () => ({
  colorCodeFor: () => '#00f',
}))

vi.mock('@/utils/browser/open-container-tab', () => ({
  openContainerTab: vi.fn<() => void>(),
}))

const tabButton = (root: HTMLElement, label: string) =>
  [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find(
    (el) => el.textContent === label,
  )!

const buttonNamed = (root: HTMLElement, text: string) =>
  [...root.querySelectorAll<HTMLButtonElement>('button')].find((el) =>
    el.textContent?.includes(text),
  )!

describe('SitesPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.shortcuts = [...allShortcuts]
  })

  it('matches snapshot on the shortcuts tab', () => {
    expect(renderSnapshot(<SitesPanel />)).toMatchSnapshot()
  })

  it('lists shortcuts with their container, opens and removes them', () => {
    const root = renderTo(<SitesPanel />)
    const rows = [...root.querySelectorAll('li')]
    expect(rows).toHaveLength(2)
    const hn = rows.find((li) => li.textContent?.includes('ycombinator'))!
    const github = rows.find((li) => li.textContent?.includes('github.com'))!
    expect(hn.textContent).toContain('No container')
    expect(github.textContent).toContain('Work')
    expect(github.querySelector('[class*="icon"]')).not.toBeNull()

    click(hn.querySelector('button')!)
    expect(openContainerTab).toHaveBeenCalledWith(
      'firefox-default',
      'https://news.ycombinator.com',
      { replaceCurrent: true },
    )

    click(hn.querySelector('[aria-label="Remove news.ycombinator.com"]')!)
    expect(remove).not.toHaveBeenCalled()
    const dialog = root.querySelector('[role="alertdialog"]')!
    expect(dialog.textContent).toContain('Delete news.ycombinator.com?')
    click(dialog.querySelectorAll('button')[0])
    expect(root.querySelector('[role="alertdialog"]')).toBeNull()
    expect(remove).not.toHaveBeenCalled()
  })

  it('removes a shortcut after confirming in the dialog', async () => {
    const root = renderTo(<SitesPanel />)
    click(root.querySelector('[aria-label="Remove news.ycombinator.com"]')!)
    const dialog = root.querySelector('[role="alertdialog"]')!
    await act(async () => {
      dialog.querySelectorAll('button')[1].click()
    })
    expect(remove).toHaveBeenCalledWith('s1')
    await vi.waitFor(() => {
      expect(root.querySelector('[role="alertdialog"]')).toBeNull()
    })
  })

  it('adds a shortcut through the inline form', async () => {
    const root = renderTo(<SitesPanel />)
    click(buttonNamed(root, 'Add shortcut'))
    const form = root.querySelector('form')!
    typeInput(form.querySelector('input')!, 'example.com')
    await act(async () => {
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    expect(add).toHaveBeenCalledWith({
      cookieStoreId: 'firefox-default',
      url: 'example.com',
    })
    expect(root.querySelector('form')).toBeNull()
  })

  it('keeps the form open and shows the message when adding fails', async () => {
    add.mockRejectedValueOnce(new Error('This website is already a shortcut.'))
    const root = renderTo(<SitesPanel />)
    click(buttonNamed(root, 'Add shortcut'))
    const form = root.querySelector('form')!
    typeInput(form.querySelector('input')!, 'news.ycombinator.com')
    await act(async () => {
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    expect(root.querySelector('form')).not.toBeNull()
    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'already a shortcut',
    )
  })

  it('shows assigned sites on the second tab without remove buttons or add form', () => {
    const root = renderTo(<SitesPanel />)
    click(tabButton(root, 'Assigned websites'))
    expect(
      tabButton(root, 'Assigned websites').getAttribute('aria-selected'),
    ).toBe('true')
    expect(root.querySelectorAll('li')).toHaveLength(1)
    expect(root.textContent).not.toContain('ycombinator')
    expect(root.querySelector('[aria-label^="Remove "]')).toBeNull()
    expect(root.textContent).not.toContain('Add shortcut')

    click(root.querySelector('li button')!)
    expect(openContainerTab).toHaveBeenCalledWith(
      'firefox-container-1',
      'https://github.com',
      { replaceCurrent: true },
    )
  })

  it('filters rows by search query', async () => {
    const root = renderTo(<SitesPanel />)
    typeInput(root.querySelector('input[type="search"]')!, 'zzz')
    await vi.waitFor(() => {
      expect(root.textContent).toMatch(/No sites match/)
    })
  })

  it('edits a shortcut in place through the prefilled form', async () => {
    const root = renderTo(<SitesPanel />)
    click(root.querySelector('[aria-label="Edit github.com"]')!)
    const form = root.querySelector('form[aria-label="Edit shortcut"]')!
    const input = form.querySelector('input')!
    expect(input.value).toBe('https://github.com/notifications')
    expect(form.querySelector('select')?.value).toBe('firefox-container-1')

    typeInput(input, 'github.com/pulls')
    await act(async () => {
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    expect(update).toHaveBeenCalledWith('s2', {
      cookieStoreId: 'firefox-container-1',
      url: 'github.com/pulls',
    })
    expect(root.querySelector('form')).toBeNull()
  })

  it('opens the remove dialog from the edit form’s Delete button', () => {
    const root = renderTo(<SitesPanel />)
    click(root.querySelector('[aria-label="Edit github.com"]')!)
    const form = root.querySelector('form[aria-label="Edit shortcut"]')!
    click(
      [...form.querySelectorAll('button')].find(
        (b) => b.textContent === 'Delete',
      )!,
    )
    expect(root.querySelector('[role="alertdialog"]')?.textContent).toContain(
      'Delete github.com?',
    )
  })

  it('replaces the empty state with the add form', () => {
    state.shortcuts = []
    const root = renderTo(<SitesPanel />)
    expect(root.textContent).toContain('No shortcuts yet')
    click(buttonNamed(root, 'Add shortcut'))
    expect(root.textContent).not.toContain('No shortcuts yet')
    expect(root.querySelector('form[aria-label="New shortcut"]')).not.toBeNull()
    expect(root.querySelector('input[type="search"]')).toBeNull()
  })
})
