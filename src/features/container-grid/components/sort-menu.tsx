import { useId, useRef, useState } from 'preact/hooks'
import { Button } from '@/components/button/button'
import css from './sort-menu.module.css'
import cx from 'classnames'
import type { SortMode } from '@/data/types'
import { SvgIcon } from '@/components/svg-icon/svg-icon'
import { useDismissOnOutsideOrEscape } from '@/utils/dom/use-dismiss-on-outside-or-escape'
import { useSortedContainers } from '@/features/container-grid/hooks/use-sorted-containers'

/** Sort options shown in the menu, in display order. */
const OPTIONS: { value: SortMode; label: string }[] = [
  { label: 'Most used', value: 'mostUsed' },
  { label: 'Alphabetical', value: 'alpha' },
  { label: 'Custom', value: 'custom' },
]

/**
 * Dropdown to pick the container grid sort mode.
 * @returns The rendered dropdown.
 */
export const SortMenu: React.FC = () => {
  const { sortMode, setSortMode } = useSortedContainers()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = OPTIONS.find((o) => o.value === sortMode) ?? OPTIONS[0]

  useDismissOnOutsideOrEscape(open, rootRef, setOpen)

  return (
    <div class={css.root} ref={rootRef}>
      <Button
        class={css.trigger}
        title="Sort containers"
        aria-label={`Sort containers: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span class={css.icon}>
          <SvgIcon name="sort" />
        </span>
        <span class={css.label}>{current.label}</span>
        <span class={css.chevron} aria-hidden="true" />
      </Button>

      {open ? (
        <ul
          id={listId}
          class={css.list}
          role="listbox"
          aria-label="Sort containers"
        >
          {OPTIONS.map(({ value, label }) => (
            <li key={value} role="presentation">
              <Button
                role="option"
                class={cx(css.option, sortMode === value && css.active)}
                aria-selected={sortMode === value}
                onClick={() => {
                  void setSortMode(value)
                  setOpen(false)
                }}
              >
                {label}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
