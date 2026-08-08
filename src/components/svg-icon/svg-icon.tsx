import css from './svg-icon.module.css'
import type { CSSProperties } from 'preact'
import cx from 'classnames'

/** Known bundled SVG glyph names (UI chrome + Firefox container icons). */
export type SvgIconName =
  | 'briefcase'
  | 'cart'
  | 'check'
  | 'chill'
  | 'circle'
  | 'contrast'
  | 'dollar'
  | 'edit'
  | 'fence'
  | 'fingerprint'
  | 'food'
  | 'fruit'
  | 'gift'
  | 'moon'
  | 'pet'
  | 'sort'
  | 'sun'
  | 'tree'
  | 'vacation'

/**
 * Packaged SVG filenames under dist/assets/icons/ (copied by Vite).
 */
const ICON_FILES: Record<SvgIconName, string> = {
  briefcase: 'briefcase.svg',
  cart: 'cart.svg',
  check: 'check.svg',
  chill: 'chill.svg',
  circle: 'circle.svg',
  contrast: 'contrast.svg',
  dollar: 'dollar.svg',
  edit: 'edit.svg',
  fence: 'fence.svg',
  fingerprint: 'fingerprint.svg',
  food: 'food.svg',
  fruit: 'fruit.svg',
  gift: 'gift.svg',
  moon: 'moon.svg',
  pet: 'pet.svg',
  sort: 'sort.svg',
  sun: 'sun.svg',
  tree: 'tree.svg',
  vacation: 'vacation.svg',
}

/**
 * Resolve a glyph name to an absolute extension URL, falling back to circle.
 * Absolute moz-extension:// URLs are required: CSS `var(--icon-url)` resolves
 * relative urls against the stylesheet (Vite HMR = localhost), not the page.
 * @param name - Glyph name (e.g. "edit", "briefcase").
 * @returns Absolute icon URL for CSS masks.
 */
export const iconUrlFor = (name: string): string => {
  const file = ICON_FILES[name as SvgIconName] ?? ICON_FILES.circle

  return browser.runtime.getURL(`assets/icons/${file}`)
}

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
