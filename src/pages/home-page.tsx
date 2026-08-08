import { ContainerGrid } from '@/features/container-grid/container-grid'
import { PageSection } from '@/components/page-section/page-section'
import { SiteAssignments } from '@/features/site-assignments/site-assignments'
import { SortMenu } from '@/features/container-grid/components/sort-menu'
import { ThemeMenu } from '@/features/theme-menu/theme-menu'
import { TopBar } from '@/components/top-bar/top-bar'

/**
 * Home page: container grid with drag sorting plus the site-assignment list.
 * @returns The rendered page.
 */
export const HomePage: React.FC = () => (
  <>
    <TopBar title="Containers">
      <SortMenu />

      <ThemeMenu />
    </TopBar>

    <main>
      <PageSection>
        <ContainerGrid />
      </PageSection>

      <PageSection title="Assigned websites">
        <SiteAssignments />
      </PageSection>
    </main>
  </>
)
