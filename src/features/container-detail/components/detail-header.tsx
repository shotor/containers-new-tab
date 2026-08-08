import {
  type SaveStatus,
  SaveStatusIndicator,
} from '@/components/save-status-indicator/save-status-indicator'
import { Button } from '@/components/button/button'
import { colorCodeFor } from '@/data/browser/browser-api'
import css from './detail-header.module.css'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

export type DetailHeaderProps = {
  title: string
  color: string
  icon: string
  status: SaveStatus
  onBack: () => void
}

/**
 * Detail top bar: back button plus a live container-colored title.
 * @param props - Title/identity preview, save status, and back callback.
 * @returns The rendered header.
 */
export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  color,
  icon,
  status,
  onBack,
}) => (
  <header class={css.root}>
    <div class={css.heading}>
      <Button variant="ghost" class={css.back} onClick={onBack}>
        ← Back
      </Button>

      <h1 class={css.title} style={{ '--title-color': colorCodeFor(color) }}>
        <SvgIcon name={icon} class={css.titleIcon} />

        <span class={css.titleLabel}>
          <span class={css.titleText}>{title}</span>

          <SaveStatusIndicator status={status} />
        </span>
      </h1>
    </div>
  </header>
)
