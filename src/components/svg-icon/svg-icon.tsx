import briefcaseUrl from '@/components/svg-icon/assets/briefcase.svg'
import cartUrl from '@/components/svg-icon/assets/cart.svg'
import checkUrl from '@/components/svg-icon/assets/check.svg'
import chillUrl from '@/components/svg-icon/assets/chill.svg'
import circleUrl from '@/components/svg-icon/assets/circle.svg'
import css from './svg-icon.module.css'
import type { CSSProperties } from 'preact'
import cx from 'classnames'
import dollarUrl from '@/components/svg-icon/assets/dollar.svg'
import editUrl from '@/components/svg-icon/assets/edit.svg'
import fenceUrl from '@/components/svg-icon/assets/fence.svg'
import fingerprintUrl from '@/components/svg-icon/assets/fingerprint.svg'
import foodUrl from '@/components/svg-icon/assets/food.svg'
import fruitUrl from '@/components/svg-icon/assets/fruit.svg'
import giftUrl from '@/components/svg-icon/assets/gift.svg'
import petUrl from '@/components/svg-icon/assets/pet.svg'
import sortUrl from '@/components/svg-icon/assets/sort.svg'
import themeDarkUrl from '@/components/svg-icon/assets/theme-dark.svg'
import themeLightUrl from '@/components/svg-icon/assets/theme-light.svg'
import themeSystemUrl from '@/components/svg-icon/assets/theme-system.svg'
import treeUrl from '@/components/svg-icon/assets/tree.svg'
import vacationUrl from '@/components/svg-icon/assets/vacation.svg'

/** Known bundled SVG glyph names (UI chrome + Firefox container icons). */
export type SvgIconName =
  | 'briefcase'
  | 'cart'
  | 'check'
  | 'chill'
  | 'circle'
  | 'dollar'
  | 'edit'
  | 'fence'
  | 'fingerprint'
  | 'food'
  | 'fruit'
  | 'gift'
  | 'pet'
  | 'sort'
  | 'theme-dark'
  | 'theme-light'
  | 'theme-system'
  | 'tree'
  | 'vacation'

/** Bundled URL for every SVG glyph, keyed by name. */
const ICON_URLS: Record<SvgIconName, string> = {
  briefcase: briefcaseUrl,
  cart: cartUrl,
  check: checkUrl,
  chill: chillUrl,
  circle: circleUrl,
  dollar: dollarUrl,
  edit: editUrl,
  fence: fenceUrl,
  fingerprint: fingerprintUrl,
  food: foodUrl,
  fruit: fruitUrl,
  gift: giftUrl,
  pet: petUrl,
  sort: sortUrl,
  'theme-dark': themeDarkUrl,
  'theme-light': themeLightUrl,
  'theme-system': themeSystemUrl,
  tree: treeUrl,
  vacation: vacationUrl,
}

/**
 * Resolve a glyph name to its bundled URL, falling back to circle.
 * @param name - Glyph name (e.g. "edit", "briefcase").
 * @returns The bundled icon URL.
 */
export const iconUrlFor = (name: string): string =>
  ICON_URLS[name as SvgIconName] ?? circleUrl

export type SvgIconProps = {
  name: string
  size?: number | string
  class?: string
  style?: CSSProperties
}

/**
 * Glyph rendered as a masked span driven by the --icon-url CSS var.
 * @param props - Glyph name, optional size, class, and extra style.
 * @returns The rendered icon.
 */
export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size,
  class: className,
  style: styleProp,
}) => {
  const style: CSSProperties = {
    ...(size != null ? { height: size, width: size } : {}),
    ...styleProp,
    '--icon-url': `url("${iconUrlFor(name)}")`,
  }

  return (
    <span class={cx(css.root, className)} style={style} aria-hidden="true" />
  )
}
