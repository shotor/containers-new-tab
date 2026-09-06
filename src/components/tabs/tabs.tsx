import cx from 'classnames'

import { Button } from '@/components/button/button'

import css from './tabs.module.css'

/** One selectable tab. */
export type TabItem<T extends string> = { value: T; label: string }

export type TabsProps<T extends string> = {
  /** Accessible name for the tab strip. */
  label: string
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  /** Page navigation (`<nav>` + aria-current) instead of in-page tabs. */
  navigation?: boolean
  class?: string
}

/**
 * Pill tab strip shared by page navigation and in-section tabs.
 * @param props - Items, current value, change callback and semantics flag.
 * @returns The rendered tab strip.
 */
export const Tabs = <T extends string>({
  label,
  items,
  value,
  onChange,
  navigation = false,
  class: className,
}: TabsProps<T>) => {
  const buttons = items.map((item) => {
    const selected = item.value === value

    return (
      <Button
        key={item.value}
        class={css.tab}
        role={navigation ? undefined : 'tab'}
        aria-current={navigation && selected ? 'page' : undefined}
        aria-selected={navigation ? undefined : selected}
        onClick={() => onChange(item.value)}
      >
        {item.label}
      </Button>
    )
  })

  return navigation ? (
    <nav class={cx(css.root, className)} aria-label={label}>
      {buttons}
    </nav>
  ) : (
    <div class={cx(css.root, className)} role="tablist" aria-label={label}>
      {buttons}
    </div>
  )
}
