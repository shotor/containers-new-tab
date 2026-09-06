import { render } from 'preact'
import { act } from 'preact/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'

import { ProxyRow } from '@/features/proxies/components/proxy-row'

import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/features/proxies/hooks/use-proxy-containers', () => ({
  useProxyContainers: () => ({ containers: [], error: '', loading: false }),
}))

vi.mock('@/data/proxy/proxy-library-api', () => ({
  proxyLibraryApi: {
    remove: vi.fn<() => Promise<void>>(async () => undefined),
    save: vi.fn<() => Promise<void>>(async () => undefined),
  },
}))
const proxy = {
  doNotProxyLocal: true,
  host: 'proxy.example',
  name: 'Office',
  port: 8080,
  type: 'http',
} as const

describe('ProxyRow', () => {
  it('opens deletion from the editor and returns to the draft on cancel', () => {
    const root = renderSnapshot(
      <ProxyRow id="office" proxy={proxy} usage={0} />,
    )
    act(() => root.querySelector('button')!.click())
    const name = root.querySelector<HTMLInputElement>('input')!
    act(() => {
      name.value = 'Draft name'
      name.dispatchEvent(new Event('input', { bubbles: true }))
    })
    act(() => root.querySelector<HTMLButtonElement>('form button')!.click())
    const dialog = root.querySelector('[role="alertdialog"]')!
    expect(dialog).not.toBeNull()
    act(() => dialog.querySelector('button')!.click())
    expect(root.querySelector('[role="alertdialog"]')).toBeNull()
    expect(root.querySelector<HTMLInputElement>('input')?.value).toBe(
      'Draft name',
    )
  })

  it('matches snapshot', () => {
    expect(
      renderSnapshot(<ProxyRow id="office" proxy={proxy} usage={1} />),
    ).toMatchSnapshot()
  })

  it('saves an inline edit', async () => {
    const root = renderSnapshot(
      <ProxyRow id="office" proxy={proxy} usage={0} />,
    )
    act(() => root.querySelector('button')!.click())
    const name = root.querySelector<HTMLInputElement>('input')!
    act(() => {
      name.value = 'Renamed'
      name.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await act(async () => {
      root
        .querySelector('form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(proxyLibraryApi.save).toHaveBeenCalledWith('office', {
      ...proxy,
      name: 'Renamed',
    })
  })

  it('opens the shared dialog without entering edit mode before deleting', async () => {
    const root = renderSnapshot(
      <ProxyRow id="office" proxy={proxy} usage={0} />,
    )
    act(() => root.querySelectorAll('button')[1].click())
    expect(proxyLibraryApi.remove).not.toHaveBeenCalled()
    expect(root.querySelector('form')).toBeNull()
    const dialog = root.querySelector('[role="alertdialog"]')!
    expect(dialog.textContent).toContain('saved proxy')
    await act(async () => dialog.querySelectorAll('button')[1].click())
    expect(proxyLibraryApi.remove).toHaveBeenCalledWith('office')
  })

  it('collapses the editor when the page becomes inactive', () => {
    const root = renderSnapshot(
      <ProxyRow id="office" proxy={proxy} usage={0} active />,
    )
    act(() => root.querySelector('button')!.click())
    expect(root.querySelector('form')).not.toBeNull()
    act(() => {
      render(
        <ProxyRow id="office" proxy={proxy} usage={0} active={false} />,
        root,
      )
    })
    expect(root.querySelector('form')).toBeNull()
  })
})
