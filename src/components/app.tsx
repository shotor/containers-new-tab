import { Router, useLocation } from 'wouter'
import css from './app.module.css'
import { DetailPage } from '@/pages/detail-page'
import { HomePage } from '@/pages/home-page'
import { Magnificence } from '@/components/magnificence/magnificence'
import { ThemeProvider } from '@/theme'
import { useHashLocation } from 'wouter/use-hash-location'

/**
 * Parse hash location into home vs container detail.
 * @param loc - Path from the router (no hash prefix).
 * @returns Detail cookieStoreId when editing, undefined when creating, null on home.
 */
const detailCookieStoreId = (loc: string): string | undefined | null => {
  if (loc === '/new') {
    return undefined
  }

  const match = /^\/edit\/([^/]+)$/.exec(loc)

  if (match) {
    return decodeURIComponent(match[1])
  }

  return null
}

/**
 * Hash routes: keep DetailPage mounted across /new → /edit/:id so create doesn't flash.
 * @returns The active page.
 */
const AppRoutes: React.FC = () => {
  const [loc] = useLocation()
  const cookieStoreId = detailCookieStoreId(loc)

  if (cookieStoreId !== null) {
    return <DetailPage cookieStoreId={cookieStoreId} />
  }

  return <HomePage />
}

/**
 * App shell: atmosphere, layout root, theme context, and hash-routed pages.
 * @returns The rendered app.
 */
export const App: React.FC = () => (
  <>
    <div class={css.atmosphere} aria-hidden="true" />

    <div class={css.root}>
      <ThemeProvider>
        <Router hook={useHashLocation}>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </div>

    <Magnificence />
  </>
)
