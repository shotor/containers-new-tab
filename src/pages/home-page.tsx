import { Button } from '@/components/button/button'
import { ContainerGrid } from '@/features/container-grid/container-grid'
import css from './home-page.module.css'
import { PageSection } from '@/components/page-section/page-section'
import { ProxyPage } from '@/pages/proxy-page'
import { ProxySortMenu } from '@/features/proxies/components/proxy-sort-menu'
import { SiteAssignments } from '@/features/site-assignments/site-assignments'
import { SortMenu } from '@/features/container-grid/components/sort-menu'
import { ThemeMenu } from '@/features/theme-menu/theme-menu'
import { TopBar } from '@/components/top-bar/top-bar'
import { useLocation } from 'wouter'

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
          <nav class={css.navigation} aria-label="Pages">
            <Button
              class={css.tab}
              aria-current={!proxies ? 'page' : undefined}
              onClick={() => navigate('/')}
            >
              Containers
            </Button>

            <Button
              class={css.tab}
              aria-current={proxies ? 'page' : undefined}
              onClick={() => navigate('/proxies')}
            >
              Proxies
            </Button>
          </nav>
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

          <PageSection title="Assigned websites">
            <SiteAssignments />
          </PageSection>
        </div>

        <div hidden={!proxies}>
          <ProxyPage active={proxies} />
        </div>
      </main>
    </>
  )
}
