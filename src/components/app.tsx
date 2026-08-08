import { Router, useLocation } from 'wouter'
import css from './app.module.css'
import type { DetailPageProps } from '@/pages/detail-page'
import { HomePage } from '@/pages/home-page'
import { Magnificence } from '@/components/magnificence/magnificence'
import { Suspense } from 'preact/compat'
import { ThemeProvider } from '@/theme'
import { useHashLocation } from 'wouter/use-hash-location'

type DetailPageComponent = React.FC<DetailPageProps>

let detailPage: DetailPageComponent | undefined
let detailPageError: unknown
let detailPagePromise: Promise<DetailPageComponent> | undefined

/**
 * Start (or reuse) loading the detail page chunk.
 * Sets the component synchronously on resolve so a finished prefetch
 * does not hit Suspense (Preact's lazy() always suspends once).
 * @returns Promise of the DetailPage component.
 */
const loadDetailPage = (): Promise<DetailPageComponent> => {
  detailPagePromise ??= import('@/pages/detail-page').then(
    (module) => {
      detailPage = module.DetailPage
      return module.DetailPage
    },
    (error: unknown) => {
      detailPageError = error
      throw error
    },
  )

  return detailPagePromise
}

// Warm the detail chunk as soon as the app shell loads.
void loadDetailPage()

/**
 * Detail page that suspends only while the chunk is still in flight.
 * @param props - Detail route props.
 * @returns The detail page, or throws a promise for Suspense.
 */
const LazyDetailPage: React.FC<DetailPageProps> = (props) => {
  if (detailPageError) {
    throw detailPageError
  }

  if (!detailPage) {
    throw loadDetailPage()
  }

  const Page = detailPage

  return <Page {...props} />
}

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
    return (
      <Suspense fallback={null}>
        <LazyDetailPage cookieStoreId={cookieStoreId} />
      </Suspense>
    )
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
