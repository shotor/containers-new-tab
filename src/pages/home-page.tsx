import { useLocation } from 'wouter'

import { PageSection } from '@/components/page-section/page-section'
import { Tabs } from '@/components/tabs/tabs'
import { TopBar } from '@/components/top-bar/top-bar'

import { SortMenu } from '@/features/container-grid/components/sort-menu'
import { ContainerGrid } from '@/features/container-grid/container-grid'
import { ProxySortMenu } from '@/features/proxies/components/proxy-sort-menu'
import { SitesPanel } from '@/features/site-assignments/sites-panel'
import { ThemeMenu } from '@/features/theme-menu/theme-menu'

import { ProxyPage } from '@/pages/proxy-page'

/** Top-level pages reachable from the home tab strip. */
const PAGES = [
  { label: 'Containers', value: '/' },
  { label: 'Proxies', value: '/proxies' },
]

/**
 * Home page with container and proxy navigation above the active content.
 * @returns The rendered page.
 */
export const HomePage: React.FC = () => {
  const [location, navigate] = useLocation()
  const proxies = location === '/proxies'

  return (
    <>
      <TopBar
        title={proxies ? 'Proxies' : 'Containers'}
        navigation={
          <Tabs
            navigation
            label="Pages"
            items={PAGES}
            value={proxies ? '/proxies' : '/'}
            onChange={navigate}
          />
        }
      >
        <div hidden={proxies}>
          <SortMenu />
        </div>

        <div hidden={!proxies}>
          <ProxySortMenu />
        </div>

        <ThemeMenu />
      </TopBar>

      <main aria-label={proxies ? 'Proxies' : 'Containers'}>
        <div hidden={proxies}>
          <PageSection>
            <ContainerGrid />
          </PageSection>

          <PageSection>
            <SitesPanel />
          </PageSection>
        </div>

        <div hidden={!proxies}>
          <ProxyPage active={proxies} />
        </div>
      </main>
    </>
  )
}
