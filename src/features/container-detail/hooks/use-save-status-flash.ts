import { useCallback, useRef, useState } from 'preact/hooks'
import type { SaveStatus } from '@/components/save-status-indicator/save-status-indicator'

const SAVE_CHECK_FADE_MS = 1400

/**
 * Pending → saved → idle flash for an autosave indicator.
 * @returns Status plus helpers to mark pending/saved or reset.
 */
export const useSaveStatusFlash = () => {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Cancel a pending fade-back-to-idle timer.
   */
  const clearFade = useCallback(() => {
    if (fadeRef.current != null) {
      clearTimeout(fadeRef.current)
      fadeRef.current = null
    }
  }, [])

  /**
   * Show the pending (saving) state and cancel any fade timer.
   */
  const setPending = useCallback(() => {
    clearFade()
    setStatus('pending')
  }, [clearFade])

  /**
   * Flash the saved checkmark, then fade back to idle.
   */
  const markSaved = useCallback(() => {
    clearFade()
    setStatus('saved')
    fadeRef.current = setTimeout(() => {
      setStatus('idle')
      fadeRef.current = null
    }, SAVE_CHECK_FADE_MS)
  }, [clearFade])

  /**
   * Clear timers and return to idle (e.g. invalid form / failed save).
   */
  const reset = useCallback(() => {
    clearFade()
    setStatus('idle')
  }, [clearFade])

  return { markSaved, reset, setPending, status }
}
