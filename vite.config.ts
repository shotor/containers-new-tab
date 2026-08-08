import { cpSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import { fileURLToPath } from 'node:url'
import preact from '@preact/preset-vite'
import { resolve } from 'node:path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import webExtension from 'vite-plugin-web-extension'

const DEV_ORIGIN = 'http://localhost:5173'
const DEV_SCRIPT_SRC = 'http://localhost:5173 http://127.0.0.1:5173'
const DEV_CONNECT_SRC =
  'ws://localhost:5173 ws://127.0.0.1:5173 http://localhost:5173 http://127.0.0.1:5173'

let isServe = false

/**
 * Record whether Vite runs in serve (dev server) mode for later hooks.
 * @returns The marker plugin.
 */
const markServeMode = (): Plugin => ({
  config(_config, env) {
    isServe = env.command === 'serve'
  },
  name: 'mark-serve-mode',
})

/**
 * Copy the extension PNG icons into the build output.
 * @returns The copy plugin.
 */
const copyStaticAssets = (): Plugin => ({
  closeBundle() {
    const out = resolve('dist/assets')
    mkdirSync(out, { recursive: true })

    for (const file of ['icon-48.png', 'icon-96.png']) {
      const src = resolve('assets', file)

      if (existsSync(src)) {
        cpSync(src, resolve(out, file))
      }
    }
  },
  name: 'copy-static-assets',
})

/**
 * Remove vite-plugin-web-extension junk like `virtual:temp.js.js.map`.
 * Colons in paths break GitHub Actions artifact upload (and NTFS).
 * @returns The scrub plugin.
 */
const scrubVirtualArtifacts = (): Plugin => ({
  closeBundle: {
    handler() {
      const dist = resolve('dist')

      if (!existsSync(dist)) {
        return
      }

      for (const name of readdirSync(dist)) {
        if (name.includes(':')) {
          unlinkSync(resolve(dist, name))
        }
      }
    },
    order: 'post',
    sequential: true,
  },
  name: 'scrub-virtual-artifacts',
})

/**
 * vite-plugin-web-extension forces HMR protocol to `http:`; WebSocket needs `ws`.
 * @returns The HMR override plugin.
 */
const forceWsHmr = (): Plugin => ({
  config() {
    return {
      server: {
        hmr: {
          clientPort: 5173,
          host: 'localhost',
          port: 5173,
          protocol: 'ws',
        },
      },
    }
  },
  enforce: 'post',
  name: 'force-ws-hmr',
})

// oxlint-disable-next-line import/no-default-export -- Vite config entry
export default defineConfig({
  base: './',
  build: {
    // Keep files during rebuild so `web-ext run -s dist` doesn't see an empty
    // folder mid-write and tear down Firefox (which also kills noVNC via the script trap).
    emptyOutDir: false,
    outDir: 'dist',
    sourcemap: true,
  },
  plugins: [
    markServeMode(),
    preact(),
    webExtension({
      additionalInputs: ['src/index.html'],
      browser: 'firefox',
      // Firefox is started by npm scripts / firefox-novnc.sh, not the plugin.
      disableAutoLaunch: true,
      htmlViteConfig: {
        plugins: [forceWsHmr()],
      },
      manifest: 'src/manifest.json',
      transformManifest(manifest) {
        if (!isServe) {
          return manifest
        }

        // Explicit ports (Firefox 147+ temporary add-ons). Runs before the
        // plugin also appends http://localhost:* via applyDevServerCsp.
        manifest.content_security_policy = {
          extension_pages: [
            `script-src 'self' 'wasm-unsafe-eval' ${DEV_SCRIPT_SRC}`,
            "object-src 'self'",
            `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${DEV_SCRIPT_SRC}`,
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            `connect-src 'self' ${DEV_CONNECT_SRC}`,
          ].join('; '),
        }
        return manifest
      },
      watchFilePaths: ['src/manifest.json'],
    }),
    copyStaticAssets(),
    viteStaticCopy({
      targets: [
        {
          dest: 'assets/icons',
          rename: { stripBase: true },
          src: 'src/components/svg-icon/assets/*.svg',
        },
      ],
    }),
    scrubVirtualArtifacts(),
  ],
  resolve: {
    alias: [
      {
        find: '@/test',
        replacement: fileURLToPath(new URL('./test', import.meta.url)),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      { find: 'react', replacement: 'preact/compat' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: 'react/jsx-dev-runtime', replacement: 'preact/jsx-dev-runtime' },
      { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
    ],
  },
  server: {
    host: '127.0.0.1',
    origin: DEV_ORIGIN,
    port: 5173,
    strictPort: true,
  },
})
