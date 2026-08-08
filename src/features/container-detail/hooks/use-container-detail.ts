import {
  type ContainerDetailFormValues,
  DEFAULT_CONTAINER_DETAIL_FORM,
  type ProxyFormValues,
  proxyFormValuesFromStored,
} from '@/features/container-detail/container-detail.schema'
import {
  listMacAssignmentsForContainer,
  type MacSiteAssignment,
  removeContainer,
} from '@/data/browser/browser-api'
import {
  type SavedIdentity,
  useIdentityAutosave,
} from '@/features/container-detail/hooks/use-identity-autosave'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { ContainerIdentity } from '@/data/browser/types'
import { extensionStorageApi } from '@/data/extension/extension-storage-api'
import { useForm } from 'react-hook-form'
import { useLocation } from 'wouter'
import { useProxyAutosave } from '@/features/container-detail/hooks/use-proxy-autosave'
import { useSaveStatusFlash } from '@/features/container-detail/hooks/use-save-status-flash'

/** Options for the container detail hook. */
export type UseContainerDetailOptions = {
  cookieStoreId?: string
}

/**
 * Container detail form state: react-hook-form plus load/autosave/delete.
 * @param options - Optional cookieStoreId when opening an existing container.
 * @returns Form instance and detail-page state/actions.
 */
export const useContainerDetail = ({
  cookieStoreId,
}: UseContainerDetailOptions) => {
  const [, navigate] = useLocation()
  const { register, reset, setValue, watch } =
    useForm<ContainerDetailFormValues>({
      defaultValues: DEFAULT_CONTAINER_DETAIL_FORM,
    })

  const [identity, setIdentity] = useState<ContainerIdentity | null>(null)
  const [loading, setLoading] = useState(Boolean(cookieStoreId))
  const [sites, setSites] = useState<MacSiteAssignment[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    status: saveStatus,
    setPending: setIdentityPending,
    markSaved: markIdentitySaved,
    reset: resetIdentitySave,
  } = useSaveStatusFlash()
  const {
    status: proxySaveStatus,
    setPending: setProxyPending,
    markSaved: markProxySaved,
    reset: resetProxySave,
  } = useSaveStatusFlash()

  const identityRef = useRef<ContainerIdentity | null>(null)
  identityRef.current = identity
  const lastSavedRef = useRef<SavedIdentity | null>(null)
  const lastProxySavedRef = useRef<ProxyFormValues | null>(null)
  const creatingRef = useRef(false)

  const values = watch()
  const {
    name,
    color,
    icon,
    type,
    host,
    port,
    username,
    password,
    doNotProxyLocal,
  } = values

  /**
   * Navigate back to the home page.
   */
  const goHome = useCallback(() => navigate('/'), [navigate])

  /**
   * Reset the form to pristine new-container state.
   */
  const resetForm = useCallback(() => {
    setIdentity(null)
    reset(DEFAULT_CONTAINER_DETAIL_FORM)
    lastSavedRef.current = null
    lastProxySavedRef.current = null
    creatingRef.current = false
    resetIdentitySave()
    resetProxySave()
    setLoading(false)
  }, [reset, resetIdentitySave, resetProxySave])

  /**
   * Populate the form from an existing container and its related data.
   * @param found - The loaded container identity.
   */
  const fillForm = useCallback(
    async (found: ContainerIdentity) => {
      setIdentity(found)
      lastSavedRef.current = {
        color: found.color,
        icon: found.icon,
        name: found.name,
      }
      creatingRef.current = false
      resetIdentitySave()
      resetProxySave()
      setSites(await listMacAssignmentsForContainer(found.cookieStoreId))
      const proxy = proxyFormValuesFromStored(
        await extensionStorageApi.getProxyForContainer(found.cookieStoreId),
      )
      // Trust boundary: Firefox returns color/icon as plain strings.
      reset({
        color: found.color as ContainerDetailFormValues['color'],
        icon: found.icon as ContainerDetailFormValues['icon'],
        name: found.name,
        ...proxy,
      })
      lastProxySavedRef.current = proxy
      setLoading(false)
    },
    [reset, resetIdentitySave, resetProxySave],
  )

  useEffect(() => {
    if (!cookieStoreId) {
      if (identityRef.current) {
        resetForm()
      } else {
        setLoading(false)
      }

      return
    }

    // Just created on /new — identity already in memory; avoid reload flash.
    if (identityRef.current?.cookieStoreId === cookieStoreId) {
      setLoading(false)
      return
    }

    const load = async () => {
      setLoading(true)
      const found = (await extensionStorageApi.getContainers()).find(
        (c) => c.cookieStoreId === cookieStoreId,
      )

      if (!found) {
        navigate('/')
        return
      }

      await fillForm(found)
    }

    void load()
  }, [cookieStoreId, navigate, resetForm, fillForm])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return
      }

      e.preventDefault()

      if (showDeleteConfirm) {
        setShowDeleteConfirm(false)
        return
      }

      goHome()
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [goHome, showDeleteConfirm])

  useIdentityAutosave({
    color,
    cookieStoreId,
    creatingRef,
    icon,
    identityRef,
    lastSavedRef,
    loading,
    markSaved: markIdentitySaved,
    name,
    navigate,
    resetSave: resetIdentitySave,
    setIdentity,
    setPending: setIdentityPending,
  })

  useProxyAutosave({
    activeCookieStoreId: identity?.cookieStoreId,
    doNotProxyLocal,
    host,
    lastProxySavedRef,
    loading,
    markSaved: markProxySaved,
    password,
    port,
    resetSave: resetProxySave,
    setPending: setProxyPending,
    type,
    username,
  })

  /**
   * Open an assigned site in a new tab beside the detail page.
   * @param url - The URL to open.
   * @param opts - active defaults to true; false opens in background.
   */
  const openAssignedSite = async (
    url: string,
    opts?: { active?: boolean },
  ): Promise<void> => {
    if (!identity) {
      return
    }

    await browser.tabs.create({
      active: opts?.active !== false,
      cookieStoreId: identity.cookieStoreId,
      url,
    })
  }

  /**
   * Delete the container and purge its proxy/usage data.
   */
  const deleteContainer = async () => {
    if (!identity) {
      return
    }

    const id = identity.cookieStoreId
    setShowDeleteConfirm(false)
    await removeContainer(id)
    await extensionStorageApi.purgeProxyForContainer(id)
    await extensionStorageApi.purgeUsageForContainer(id)
    goHome()
  }

  /**
   * Update the color field (custom control; not a native input).
   * @param next - Next container color name.
   */
  const setColor = (next: ContainerDetailFormValues['color']): void => {
    setValue('color', next, { shouldDirty: true })
  }

  /**
   * Update the icon field (custom control; not a native input).
   * @param next - Next container icon name.
   */
  const setIcon = (next: ContainerDetailFormValues['icon']): void => {
    setValue('icon', next, { shouldDirty: true })
  }

  return {
    deleteContainer,
    goHome,
    identity,
    loading,
    openAssignedSite,
    proxySaveStatus,
    register,
    saveStatus,
    setColor,
    setIcon,
    setShowDeleteConfirm,
    showDeleteConfirm,
    sites,
    // Empty name should fall through; ?? would keep ''.
    // oxlint-disable-next-line typescript/prefer-nullish-coalescing
    title: name.trim() || identity?.name || 'New container',
    values,
  }
}
