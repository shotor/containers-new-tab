import { createContainer, updateContainer } from '@/data/browser/browser-api'
import type { ContainerIdentity } from '@/data/browser/types'
import { debounce } from '@/utils/function/debounce'
import { identityPersistSchema } from '@/features/container-detail/container-detail.schema'
import { useEffect } from 'preact/hooks'

const IDENTITY_SAVE_MS = 400

/** Identity fields as last persisted (to skip redundant saves). */
export type SavedIdentity = { name: string; color: string; icon: string }

export type UseIdentityAutosaveOptions = {
  loading: boolean
  cookieStoreId?: string
  name: string
  color: string
  icon: string
  identityRef: { current: ContainerIdentity | null }
  lastSavedRef: { current: SavedIdentity | null }
  creatingRef: { current: boolean }
  setIdentity: (identity: ContainerIdentity) => void
  setPending: () => void
  markSaved: () => void
  resetSave: () => void
  navigate: (to: string, options?: { replace?: boolean }) => void
}

/**
 * Debounced identity autosave: create on first valid name, then update.
 * @param options - Form values, refs, and save-status helpers.
 */
export const useIdentityAutosave = ({
  loading,
  cookieStoreId,
  name,
  color,
  icon,
  identityRef,
  lastSavedRef,
  creatingRef,
  setIdentity,
  setPending,
  markSaved,
  resetSave,
  navigate,
}: UseIdentityAutosaveOptions): void => {
  useEffect(() => {
    if (loading) {
      return
    }

    const identityResult = identityPersistSchema.safeParse({
      color,
      icon,
      name,
    })

    if (!identityResult.success) {
      resetSave()
      return
    }

    const persisted = identityResult.data
    const saved = lastSavedRef.current

    if (
      saved &&
      saved.name === persisted.name &&
      saved.color === persisted.color &&
      saved.icon === persisted.icon
    ) {
      return
    }

    setPending()

    const save = debounce(() => {
      void (async () => {
        const current = identityRef.current

        if (!current) {
          if (cookieStoreId) {
            return
          }

          if (creatingRef.current) {
            return
          }

          creatingRef.current = true

          try {
            const created = await createContainer(
              persisted.name,
              persisted.color,
              persisted.icon,
            )
            lastSavedRef.current = {
              color: created.color,
              icon: created.icon,
              name: created.name,
            }
            setIdentity(created)
            markSaved()
            navigate(`/edit/${created.cookieStoreId}`, { replace: true })
          } catch {
            creatingRef.current = false
            resetSave()
          }

          return
        }

        try {
          const updated = await updateContainer(current.cookieStoreId, {
            color: persisted.color,
            icon: persisted.icon,
            name: persisted.name,
          })
          lastSavedRef.current = {
            color: updated.color,
            icon: updated.icon,
            name: updated.name,
          }
          setIdentity(updated)
          markSaved()
        } catch {
          resetSave()
        }
      })()
    }, IDENTITY_SAVE_MS)

    save()

    return () => {
      save.cancel()
    }
  }, [
    name,
    color,
    icon,
    loading,
    cookieStoreId,
    navigate,
    setPending,
    markSaved,
    resetSave,
    identityRef,
    lastSavedRef,
    creatingRef,
    setIdentity,
  ])
}
