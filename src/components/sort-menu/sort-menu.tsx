import cx from 'classnames'
import { useId, useRef, useState } from 'preact/hooks'

import { Button } from '@/components/button/button'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

import type { SortDirection } from '@/data/types'

import { useDismissOnOutsideOrEscape } from '@/utils/dom/use-dismiss-on-outside-or-escape'

import css from './sort-menu.module.css'

/** One selectable sort mode. */
export type SortOption<T extends string> = { value: T; label: string }

export type SortMenuProps<T extends string> = {
  /** Accessible name, e.g. "Sort containers". */
  label: string
  options: SortOption<T>[]
  value: T
  direction?: SortDirection
  /** Modes that never reverse (no flipped icon, no hint). */
  fixed?: readonly T[]
  onSelect: (value: T) => void
}

/**
 * Dropdown to pick a sort mode; the owner decides what re-selecting does
 * (normally: flip the direction, which mirrors the sort glyph).
 * @param props - Options, current selection and change callback.
 * @returns The rendered dropdown.
 */
export const SortMenu = <T extends string>({
  label,
  options,
  value,
  direction = 'asc',
  fixed = [],
  onSelect,
}: SortMenuProps<T>) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = options.find((o) => o.value === value) ?? options[0]
  const reversible = !fixed.includes(value)
  const reversed = reversible && direction === 'desc'

  useDismissOnOutsideOrEscape(open, rootRef, setOpen)

  return (
    <div class={css.root} ref={rootRef}>
      <Button
        class={css.trigger}
        title={label}
        aria-label={`${label}: ${current.label}${reversed ? ' (reversed)' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span class={cx(css.icon, reversed && css.reversed)}>
          <SvgIcon name="sort" />
        </span>
        <span class={css.label}>{current.label}</span>
        <span class={css.chevron} aria-hidden="true" />
      </Button>

      {open ? (
        <ul id={listId} class={css.list} role="listbox" aria-label={label}>
          {options.map((option) => (
            <li key={option.value} role="presentation">
              <Button
                role="option"
                class={cx(css.option, value === option.value && css.active)}
                aria-selected={value === option.value}
                title={
                  value === option.value && reversible
                    ? 'Click again to reverse'
                    : undefined
                }
                onClick={() => {
                  onSelect(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
