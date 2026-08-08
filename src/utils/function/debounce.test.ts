import { afterEach, describe, expect, it, vi } from 'vitest'
import { debounce } from '@/utils/function/debounce'

describe('debounce', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('invokes only after the quiet period', () => {
    vi.useFakeTimers()
    const fn = vi.fn<(value: string) => void>()
    const debounced = debounce(fn, 100)

    debounced('a')
    debounced('b')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith('b')
  })

  it('cancel prevents a pending invocation', () => {
    vi.useFakeTimers()
    const fn = vi.fn<() => void>()
    const debounced = debounce(fn, 100)

    debounced()
    debounced.cancel()
    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
  })
})
