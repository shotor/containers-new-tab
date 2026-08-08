import { AssignedSites } from '@/features/container-detail/components/assigned-sites'
import css from '@/features/container-detail/container-detail.module.css'
import { DangerZone } from '@/features/container-detail/components/danger-zone'
import { DeleteConfirmDialog } from '@/features/container-detail/components/delete-confirm-dialog'
import { DetailHeader } from '@/features/container-detail/components/detail-header'
import { Identity } from '@/features/container-detail/components/identity'
import { PageSection } from '@/components/page-section/page-section'
import { Proxy } from '@/features/container-detail/components/proxy'
import { SaveStatusIndicator } from '@/components/save-status-indicator/save-status-indicator'
import { useContainerDetail } from '@/features/container-detail/hooks/use-container-detail'

export type DetailPageProps = {
  cookieStoreId?: string
}

/**
 * Container detail page: identity, assigned websites, proxy, danger zone.
 * @param props - Optional cookieStoreId when opening an existing container.
 * @returns The rendered detail page.
 */
export const DetailPage: React.FC<DetailPageProps> = ({ cookieStoreId }) => {
  const detail = useContainerDetail({ cookieStoreId })

  if (detail.loading) {
    return <p class="empty">Loading…</p>
  }

  return (
    <>
      <DetailHeader
        title={detail.title}
        color={detail.values.color}
        icon={detail.values.icon}
        status={detail.saveStatus}
        onBack={detail.goHome}
      />

      <PageSection title="Identity">
        <Identity
          register={detail.register}
          values={detail.values}
          onColorChange={detail.setColor}
          onIconChange={detail.setIcon}
        />
      </PageSection>

      <PageSection title="Assigned websites">
        <AssignedSites
          sites={detail.sites}
          onOpenSite={detail.openAssignedSite}
        />
      </PageSection>

      <PageSection
        title={
          <>
            <span>Proxy</span>
            <SaveStatusIndicator
              status={detail.proxySaveStatus}
              class={css.saveStatusMuted}
            />
          </>
        }
      >
        <Proxy register={detail.register} values={detail.values} />
      </PageSection>

      {detail.identity ? (
        <DangerZone onDelete={() => detail.setShowDeleteConfirm(true)} />
      ) : null}

      {detail.showDeleteConfirm && detail.identity ? (
        <DeleteConfirmDialog
          name={detail.title}
          color={detail.values.color}
          icon={detail.values.icon}
          onCancel={() => detail.setShowDeleteConfirm(false)}
          onConfirm={() => void detail.deleteContainer()}
        />
      ) : null}
    </>
  )
}
