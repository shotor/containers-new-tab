# AGENTS.md — Containers Tab

Firefox extension that replaces **new tab** and **homepage** with a container picker, site-assignment list (from MAC), and container editor.

## Commands

```bash
npm install
npm run build          # tsc --noEmit && vite build → dist/
npm run package        # clean build + zip into web-ext-artifacts/ (AMO-publishable)
npm start              # build + web-ext run (needs local Firefox + display)
npm run dev            # Vite HMR server (new-tab UI); writes dist/ for web-ext
npm run dev:watch      # full rebuild on change (no HMR; use if Vite HMR unavailable)
npm run test           # vitest run (unit tests next to mirrored files)
npm run test:watch     # vitest watch mode
npm run test:coverage  # vitest run --coverage
npm run lint           # prettier --check + oxlint
npm run lint:fix       # prettier --write + oxlint --fix
npm run typecheck      # tsc --noEmit
npm run test:firefox   # Xvfb + noVNC + Firefox 147+ with Vite HMR
```

Git hooks via **husky**: `.husky/pre-commit` runs `npm run lint` (locally, or over `ssh ff-containers-tab.devsy` when npm is missing on the host).

Dependencies are **pinned** (`.npmrc` has `save-exact=true`); keep exact versions in package.json.

### CI/CD (GitHub Actions)

- `.github/workflows/pull-request.yml` — on every PR: `test` + `lint` + `build` run in parallel; any failure fails the run.
- `.github/workflows/release.yml` — on **push to main** (merged PR or direct push): `version` check first (`cz bump --get-next` — no bumpable commits ⇒ stop) → `lint` + `test` (parallel; both must succeed) → `build` job that bumps version files locally (commit + tag, **no push yet**), builds `dist`, **then** pushes the bump commit/tag over SSH → separate `publish` job downloads `dist`, packs a `git archive` source zip for reviewers, and runs `web-ext sign --upload-source-code` to AMO (re-runnable alone if signing fails). Needs repo secrets `AMO_API_KEY` / `AMO_API_SECRET` (AMO JWT) and `RELEASE_DEPLOY_KEY` (private half of a **write** deploy key; allow Deploy keys to bypass protected `main`). Bump commits start with `bump:` so the workflow does not recurse. First-time AMO submission must go through the Dev Hub once. Requires one initial version tag (created manually).

### Testing in the browser (noVNC)

This environment has no GUI. We use **noVNC** (lighter than Guacamole, same idea: Firefox in your browser).

1. **Rebuild the devcontainer** so the Dockerfile installs `firefox-esr`, `xvfb`, `x11vnc`, `novnc`, `fluxbox` (ESR is fallback; the script downloads Firefox **147+** for HMR).
2. Run `npm run test:firefox`.
3. Open the forwarded port **6080** → `http://localhost:6080/vnc.html` → Connect.
4. Firefox starts with the extension loaded via `web-ext`; **new-tab UI hot-reloads** via Vite on `:5173`.

HMR needs Firefox **147+** (temporary MV3 add-ons may load `http://localhost` scripts). The noVNC script caches a release build under `.cache/firefox/` when system Firefox is too old.

Background-script edits still rebuild into `dist/` and need a web-ext extension reload (not HMR).

Optional host-Docker path: `docker compose -f docker-compose.firefox.yml up` then load `dist/` as a temporary add-on inside that Firefox.

Load unpacked without noVNC: run `npm run dev`, then point Firefox temporary add-on at `dist/` (or use `npm start` on a machine with a real display).

## Layout

| Path                                                     | Role                                                                                                                                                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.tsx` / `main.css` / `index.html` / `theme.tsx` | Entry, global tokens/reset, theme context                                                                                                                                                                       |
| `src/pages/`                                             | Page composition (`home-page`, `detail-page`) + co-located `*.module.css` when needed                                                                                                                           |
| `src/components/`                                        | Shared UI (`app`, `badge/`, `button/`, `notice/`, `page-section/`, `search/`, `site-row/`, `save-status-indicator/`, `sortable-tile/`, `svg-icon/`, `top-bar/`) + co-located `*.module.css`                     |
| `src/data/`                                              | Browser APIs (`browser/api` + `browser-api` + `browser/types`), extension storage (`extension/api` + `extension-storage-api`), proxy (`proxy/api` + `proxy-cache` + `proxy-cache-api` + `proxy/utils`), parsers |
| `src/features/<feature>/`                                | Features: `container-grid`, `container-detail`, `site-assignments`, `theme-menu` — `hooks/`, section UI, co-located `*.module.css`                                                                              |
| `src/utils/`                                             | Generic one-function files by kind (`array/`, `browser/`, `dom/`, `function/`, `object/`, `search/`, `url/`)                                                                                                    |
| `src/background.ts`                                      | `proxy.onRequest` + proxy auth + startup tab repair                                                                                                                                                             |
| `src/manifest.json`                                      | MV3 manifest (Vite plugin resolves TS/HTML paths into `dist/`)                                                                                                                                                  |
| `test/`                                                  | Shared Vitest helpers (`setup`, `render-snapshot`, `render-hook`); imported as `@/test/…`                                                                                                                       |

Dependency flow: `utils` ← `data` ← `features` / `components` ← `pages`. Pages compose feature sections + shared UI. Feature sections (not presentational children) wire their own data/hooks/actions instead of prop-drilling from the page.

## Conventions

Enforced by oxlint (`.oxlintrc.json`) + prettier (`.prettierrc`):

- Files: lowercase kebab-case (`unicorn/filename-case`).
- Functions: arrow expressions only (`func-style`, `prefer-arrow-callback`); functional collection chains over loops unless less readable; no classes.
- `if` always with braces (`curly: all`).
- JSDoc on every named function with `@param` / `@returns` / `@throws` (`jsdoc/require-param`, `jsdoc/require-returns`); multi-line blocks (single-line tags don't parse). `jsdoc/require-param` uses `interfaceExemptsParamsCheck` so typed destructured props/options (`({ … }: FooProps)`) may keep a single `@param props` (or `@param options`) covering the object.
- Components: PascalCase; every component with props defines a `MyComponentProps` type; annotate with `React.FC<Props>` (global `React` namespace from `preact/compat` — do not `import * as React`). Destructure immediately in the parameter list (`({ … }: MyComponentProps) =>` / `React.FC<…> = ({ … }) =>`), never `props: FooProps` then `const { … } = props` in the body when you only need fields. Multiline destructuring when there are multiple fields; a single field can stay compact (`({ children }: NoticeProps) =>`). When the whole props object is still needed (spread / pass-through), keep `props` — but prefer destructuring (`…rest` in the signature for Button-style wrappers). Hooks that take an options object follow the same rule. JSDoc may keep a single `@param props` (or `@param options`) covering the object; children use Preact’s `ComponentChildren`; >100 lines is a smell — split. Do not import `react` / `React` for values — JSX comes from Preact (`jsxImportSource`).
- CSS modules (`*.module.css`): co-locate with the component; when the component has a single outermost wrapper element, that class is named `.root`. Fragments / multi-region UIs without a single wrapper are exempt — use a descriptive class (e.g. `.list`). Import the colocated/primary sheet as `css` (`import css from './foo.module.css'`; `class={css.root}`). A second shared sheet is `<purpose>Css` (e.g. `detailCss`, `tileCss`); if the file has no colocated sheet and only one foreign sheet, that one is `css`. Merge classes with `cx` from `classnames` (`import cx from 'classnames'`). Class names in the module file are always camelCase (`.brandName`, `.iconWrap` — never kebab-case). Inner/element classes stay descriptive without repeating the component name (`open`, `title`, … — not `tileOpen`). Shared non-component sheets (e.g. `container-detail.module.css` field helpers) are also exempt from `.root`. App-wide tokens/reset live in plain `src/main.css` (side-effect import from `main.tsx` — not a CSS module). Prefer `import type { CSSProperties } from 'preact'` over deprecated `JSX.CSSProperties`.
- Imports: `@/<folder>` aliases into `src/`; oxlint `sort-imports` ordering (multi-member imports before single-member). Do **not** insert blank lines between import statements to “fix” sort order — leave imports contiguous; oxlint owns that. One blank line after the import block before code is fine (`import/newline-after-import`).
- **No barrels**: never add `index.ts` re-export files; import from the concrete module path. Named facades are fine when intentional (e.g. `browser-api.ts`).
- Unused code is a warning (`no-unused-vars: warn`) — delete it instead.
- Utils are one-export files; tiny one-liners used once get inlined instead.
- Prettier: 2 spaces, trailing commas, no semicolons, single quotes (double quotes for JSX attributes). Oxlint `@stylistic/quotes` + `@stylistic/jsx-quotes` mirror that.
- Newlines between logical code blocks when it improves readability (don’t pack unrelated statements together). **Does not apply to imports** — keep the import block contiguous (see Imports above). Skip blank lines between short, tightly related one-liners. Do use a blank line after a multi-line block before following lines, and between consecutive multi-line blocks — dense stacked multi-line expects are hard to scan. Always put a blank line before a `try` / `catch`. Always put a blank line before an `if` when it follows other statements in the same block (setup/declarations then the guard — not jammed on the next line); no extra blank when `if` is the first statement in the block, and none between `else` and `if` in an `else if`. Always put a blank line after a multi-line assignment or declaration (including multi-line `useState`) before the next statement. Multi-line inline functions (callbacks, arrow handlers, etc.) also get a blank line after them when the next sibling follows in the same block — except when they are the callback passed to a closer like `.map` / `.filter` / `.find` / similar (no blank line forced after those). In JSX/HTML, put a blank line between sibling multi-line elements/sections (e.g. `.brand` then `.topbar-controls`, `SortMenu` then `ThemeMenu`). (Not enforced by oxlint — no padding-line rule yet.)
- Types: everything typed; inference over `as` — casts only at trust boundaries (browser storage, external extension messages), with a comment saying why.
- Tests: colocate as close as possible to the unit under test — for a single-function file `foo.ts`, use `foo.test.ts` beside it (not a parent-folder suite). Mock that file's collaborators (`vi.mock` modules, `vi.stubGlobal("browser", …)`); skip trivial assertions. **Components:** every component file gets one HTML snapshot test (refactor safety). Add behavior tests only when the component has non-trivial logic of our own. Mock hooks, context providers, data/browser modules, and 3rd-party libs — do **not** mock simple presentational internal components (Button, Label, SvgIcon, …).

## Architecture

- **Identity** (name/color/icon): Firefox `contextualIdentities` API.
- **Site assignments (“always open in”)**: **Multi-Account Containers (MAC)** is the source of truth. We only _read_ via `runtime.sendMessage("@testpilot-containers", { method: "getAssignment", url })`. We never write MAC storage and we do not store or enforce assignments ourselves.
- **Proxy**: owned by this extension in `browser.storage.local`.
- Home / editor assignment lists: probe top sites with MAC `getAssignment` (MAC has no bulk list API). Editor rows open the site in a **new** tab in that container (editor stays open).

## Storage keys (`browser.storage.local`)

| Key                | Shape                                 |
| ------------------ | ------------------------------------- |
| `sortMode`         | `"mostUsed" \| "alpha" \| "custom"`   |
| `themeMode`        | `"system" \| "light" \| "dark"`       |
| `usageCounts`      | `{ [cookieStoreId]: number }`         |
| `customOrder`      | `cookieStoreId[]`                     |
| `containerProxies` | `{ [cookieStoreId]: ContainerProxy }` |

Defaults live in `src/data/types.ts`.

## Permissions (why)

- `contextualIdentities` + `cookies` — list/create/update/remove containers; open tabs in a store; required to message MAC
- `tabs` — create/remove
- `storage` — settings above
- `topSites` — probe candidates for MAC assignment discovery
- `proxy` + `<all_urls>` — per-container proxy
- `webRequest` + `webRequestBlocking` — proxy auth when credentials set
- Overrides: `chrome_url_overrides.newtab` + `chrome_settings_overrides.homepage`
- `data_collection_permissions: { required: ["none"] }` — this extension collects no data (required key for new Firefox extensions)

## Gotchas

1. **MV3 event page**: register `proxy.onRequest`, tab, and auth listeners at **top level** in `background.ts` so the worker wakes.
2. **MAC assignments**: only discoverable per-URL; hosts not in top sites won’t appear until probed.
3. **Delete container**: wipes that identity’s cookie jar; UI hard-confirms; we also purge our proxy/usage keys for that id (not MAC’s assignments).
4. **Proxy passwords**: stored in `storage.local` only — never log them, never put real secrets in docs.
5. **Icons**: Firefox container glyphs are the official SVGs from mozilla-central (`browser/components/contextualidentity/content/`, MPL-2.0), vendored under `src/components/svg-icon/assets/` with `fill="black"` so CSS masks work (`context-fill` is Firefox-only). UI chrome glyphs (`edit`, `sort`, theme, …) are separate. Render via `SvgIcon` — `resource://usercontext-content/*` is not loadable from extension pages. Extension PNGs under `assets/` are copied into `dist/assets` at build time.
6. **Build `base: "./"`**: required so HTML/JS/CSS paths work as `moz-extension://` pages.
7. **Dev HMR**: `npm run dev` / `test:firefox` rewrite the new-tab HTML to load modules from `http://localhost:5173`. That only works on Firefox **147+** with a _temporary_ add-on. Manual refresh of a stale production `dist/` tab will not pick up HMR — restart `test:firefox` (or open a fresh `about:newtab` after Vite is up).

## Where to change what

- Grid / sort / site list → `src/pages/home-page.tsx` + `src/features/container-grid/` + `src/features/site-assignments/` + co-located `*.module.css`
- Detail page → `src/pages/detail-page.tsx` + `src/features/container-detail/` (routes `#/new`, `#/edit/:cookieStoreId`)
- Global look (tokens / reset) → `src/main.css`
- App shell / routing → `src/components/app.tsx` + `src/main.tsx`
- Proxy → `src/background.ts` + `src/data/proxy/proxy-cache-api.ts` / `proxy-cache.ts` / `proxy/api/` / `proxy/utils/`
- Schema → `src/data/types.ts` + `extension/extension-storage-api.ts` + `extension/parsers/`; small pure pieces → `src/utils/` / `src/data/utils/`
