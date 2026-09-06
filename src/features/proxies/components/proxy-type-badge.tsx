import css from './proxy-type-badge.module.css'
import cx from 'classnames'
import type { ProxyType } from '@/data/types'

/** Display label per proxy type (Firefox's `socks` means SOCKS5). */
const LABELS: Record<ProxyType, string> = {
  direct: 'DIRECT',
  http: 'HTTP',
  https: 'HTTPS',
  socks: 'SOCKS5',
  socks4: 'SOCKS4',
}

export type ProxyTypeBadgeProps = {
  type: ProxyType
}

/**
 * Small color-coded pill naming a proxy protocol.
 * @param props - The proxy type.
 * @returns The rendered badge.
 */
export const ProxyTypeBadge: React.FC<ProxyTypeBadgeProps> = ({ type }) => (
  <span class={cx(css.root, css[type])}>{LABELS[type]}</span>
)
