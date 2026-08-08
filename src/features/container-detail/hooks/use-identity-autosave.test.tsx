import { afterEach, describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import type { ContainerIdentity } from '@/data/browser/types'
import { renderHook } from '@/test/render-hook'
import { useIdentityAutosave } from '@/features/container-detail/hooks/use-identity-autosave'

const { createContainer, updateContainer } = vi.hoisted(() => ({
  createContainer: vi.fn<() => Promise<ContainerIdentity>>(),
  updateContainer: vi.fn<() => Promise<ContainerIdentity>>(),
}))

vi.mock('@/data/browser/browser-api', async () => {
  const actual = await vi.importActual<
    typeof import('@/data/browser/browser-api')
  >('@/data/browser/browser-api')
  return {
    ...actual,
    createContainer,
    updateContainer,
  }
})

describe('useIdentityAutosave', () => {
  afterEach(() => {
    vi.useRealTimers()
    createContainer.mockReset()
    updateContainer.mockReset()
  })

  it('creates a container after debounce when none exists', async () => {
    vi.useFakeTimers()
    createContainer.mockResolvedValue({
      color: 'blue',
      colorCode: '#0000ff',
      cookieStoreId: 'firefox-container-1',
      icon: 'briefcase',
      iconUrl: 'resource://usercontext-content/briefcase.svg',
      name: 'Work',
    })

    const identityRef = { current: null as ContainerIdentity | null }
    const lastSavedRef = {
      current: null as null | { name: string; color: string; icon: string },
    }
    const creatingRef = { current: false }
    const setPending = vi.fn<() => void>()
    const markSaved = vi.fn<() => void>()
    const resetSave = vi.fn<() => void>()
    const navigate =
      vi.fn<(to: string, options?: { replace?: boolean }) => void>()
    const setIdentity = vi.fn<(identity: ContainerIdentity) => void>()

    renderHook(() =>
      useIdentityAutosave({
        color: 'blue',
        creatingRef,
        icon: 'briefcase',
        identityRef,
        lastSavedRef,
        loading: false,
        markSaved,
        name: 'Work',
        navigate,
        resetSave,
        setIdentity,
        setPending,
      }),
    )

    expect(setPending).toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(createContainer).toHaveBeenCalledWith('Work', 'blue', 'briefcase')
    expect(setIdentity).toHaveBeenCalledWith(
      expect.objectContaining({ cookieStoreId: 'firefox-container-1' }),
    )
    expect(navigate).toHaveBeenCalledWith('/edit/firefox-container-1', {
      replace: true,
    })
    expect(markSaved).toHaveBeenCalled()
  })

  it('updates an existing identity after debounce', async () => {
    vi.useFakeTimers()
    updateContainer.mockResolvedValue({
      color: 'blue',
      colorCode: '#0000ff',
      cookieStoreId: 'firefox-container-1',
      icon: 'briefcase',
      iconUrl: 'resource://usercontext-content/briefcase.svg',
      name: 'Home',
    })

    const identityRef = {
      current: {
        color: 'blue',
        cookieStoreId: 'firefox-container-1',
        icon: 'briefcase',
        name: 'Work',
      } as ContainerIdentity,
    }
    const lastSavedRef = {
      current: { color: 'blue', icon: 'briefcase', name: 'Work' },
    }
    const creatingRef = { current: false }
    const setPending = vi.fn<() => void>()
    const markSaved = vi.fn<() => void>()
    const resetSave = vi.fn<() => void>()
    const navigate = vi.fn<(to: string) => void>()
    const setIdentity = vi.fn<(identity: ContainerIdentity) => void>()

    renderHook(() =>
      useIdentityAutosave({
        color: 'blue',
        cookieStoreId: 'firefox-container-1',
        creatingRef,
        icon: 'briefcase',
        identityRef,
        lastSavedRef,
        loading: false,
        markSaved,
        name: 'Home',
        navigate,
        resetSave,
        setIdentity,
        setPending,
      }),
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(updateContainer).toHaveBeenCalledWith('firefox-container-1', {
      color: 'blue',
      icon: 'briefcase',
      name: 'Home',
    })
    expect(setIdentity).toHaveBeenCalled()
    expect(markSaved).toHaveBeenCalled()
  })
})
