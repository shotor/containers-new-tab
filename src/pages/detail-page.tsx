import { AssignedSites } from '@/features/container-detail/components/assigned-sites'
import { DangerZone } from '@/features/container-detail/components/danger-zone'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog/delete-confirm-dialog'
import { DetailHeader } from '@/features/container-detail/components/detail-header'
import { Identity } from '@/features/container-detail/components/identity'
import { PageSection } from '@/components/page-section/page-section'
import { Proxy } from '@/features/container-detail/components/proxy'
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
    return null
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

      <PageSection title="Proxy">
        <Proxy cookieStoreId={detail.identity?.cookieStoreId} />
      </PageSection>

      {detail.identity ? (
        <DangerZone onDelete={() => detail.setShowDeleteConfirm(true)} />
      ) : null}

      {detail.showDeleteConfirm && detail.identity ? (
        <DeleteConfirmDialog
          description="This permanently deletes the container and its cookie jar — logins and site data for this identity. This cannot be undone."
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
