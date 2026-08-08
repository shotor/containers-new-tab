import { Button, ButtonRow } from '@/components/button/button'
import { PageSection } from '@/components/page-section/page-section'

export type DangerZoneProps = {
  onDelete: () => void
}

/**
 * Delete-container danger zone.
 * @param props - Callback when the delete button is pressed.
 * @returns The rendered section.
 */
export const DangerZone: React.FC<DangerZoneProps> = ({ onDelete }) => (
  <PageSection title="Danger Zone">
    <ButtonRow>
      <Button variant="danger" onClick={onDelete}>
        Delete Container
      </Button>
    </ButtonRow>
  </PageSection>
)
