import { useId } from 'preact/hooks'

import { Button } from '@/components/button/button'
import { SvgIcon } from '@/components/svg-icon/svg-icon'

import { useProxyContainers } from '@/features/proxies/hooks/use-proxy-containers'

import css from './proxy-containers.module.css'

export type ProxyContainersProps = {
  proxyId: string
}

/**
 * Show the containers using a proxy below its editable settings.
 * @param props - Saved proxy identifier.
 * @returns An assignment list or its empty state.
 */
export const ProxyContainers: React.FC<ProxyContainersProps> = ({
  proxyId,
}) => {
  const { containers, loading, error } = useProxyContainers(proxyId)
  const titleId = useId()

  return (
    <section class={css.root} aria-labelledby={titleId}>
      <h3 id={titleId} class={css.title}>
        Used by containers
      </h3>

      {loading ? (
        <p class={css.message}>Loading containers…</p>
      ) : error ? (
        <p role="alert" class={css.message}>
          {error}
        </p>
      ) : containers.length ? (
        <ul class={css.list}>
          {containers.map((container) => (
            <li key={container.cookieStoreId}>
              <Button
                class={css.link}
                onClick={() => {
                  window.location.hash = `/edit/${encodeURIComponent(container.cookieStoreId)}`
                }}
              >
                <SvgIcon
                  name={container.icon}
                  class={css.icon}
                  style={{ color: container.colorCode }}
                />
                {container.name}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p class={css.message}>No containers use this proxy yet.</p>
      )}
    </section>
  )
}
