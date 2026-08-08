import { SvgIcon, type SvgIconName } from '@/components/svg-icon/svg-icon'
import { useId, useRef, useState } from 'preact/hooks'
import { Button } from '@/components/button/button'
import css from './theme-menu.module.css'
import cx from 'classnames'
import type { ThemeMode } from '@/data/types'
import { useDismissOnOutsideOrEscape } from '@/utils/dom/use-dismiss-on-outside-or-escape'
import { useTheme } from '@/theme'

/** Theme options shown in the menu, in display order. */
const OPTIONS: { value: ThemeMode; label: string }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]

/** Map theme mode to its glyph in {@link SvgIcon}. */
const THEME_ICON: Record<ThemeMode, SvgIconName> = {
  dark: 'theme-dark',
  light: 'theme-light',
  system: 'theme-system',
}

/**
 * Dropdown to pick the color theme.
 * @returns The rendered dropdown.
 */
export const ThemeMenu: React.FC = () => {
  const { themeMode, setMode } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = OPTIONS.find((o) => o.value === themeMode) ?? OPTIONS[0]

  useDismissOnOutsideOrEscape(open, rootRef, setOpen)

  return (
    <div class={css.root} ref={rootRef}>
      <Button
        class={css.trigger}
        title={`Theme: ${current.label}`}
        aria-label={`Color theme: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <SvgIcon name={THEME_ICON[themeMode]} />
      </Button>

      {open ? (
        <ul
          id={listId}
          class={css.list}
          role="listbox"
          aria-label="Color theme"
        >
          {OPTIONS.map(({ value, label }) => (
            <li key={value} role="presentation">
              <Button
                role="option"
                class={cx(css.option, themeMode === value && css.active)}
                title={label}
                aria-label={label}
                aria-selected={themeMode === value}
                onClick={() => {
                  void setMode(value)
                  setOpen(false)
                }}
              >
                <SvgIcon name={THEME_ICON[value]} />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
