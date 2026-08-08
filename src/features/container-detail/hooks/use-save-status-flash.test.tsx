import { afterEach, describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import { renderHook } from '@/test/render-hook'
import { useSaveStatusFlash } from '@/features/container-detail/hooks/use-save-status-flash'

describe('useSaveStatusFlash', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves pending → saved → idle', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(() => useSaveStatusFlash())

    expect(result.current.status).toBe('idle')

    act(() => {
      result.current.setPending()
    })
    rerender()
    expect(result.current.status).toBe('pending')

    act(() => {
      result.current.markSaved()
    })
    rerender()
    expect(result.current.status).toBe('saved')

    act(() => {
      vi.advanceTimersByTime(1400)
    })
    rerender()
    expect(result.current.status).toBe('idle')
  })

  it('reset returns to idle and clears timers', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(() => useSaveStatusFlash())

    act(() => {
      result.current.markSaved()
    })
    rerender()

    act(() => {
      result.current.reset()
    })
    rerender()
    expect(result.current.status).toBe('idle')

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    rerender()
    expect(result.current.status).toBe('idle')
  })
})
