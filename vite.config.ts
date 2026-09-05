import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import preact from '@preact/preset-vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import webExtension from 'vite-plugin-web-extension'

const DEV_SCRIPT_SRC = 'http://localhost:5173 http://127.0.0.1:5173'
const DEV_CONNECT_SRC =
  'ws://localhost:5173 ws://127.0.0.1:5173 http://localhost:5173 http://127.0.0.1:5173'

// oxlint-disable-next-line import/no-default-export -- Vite config entry
export default defineConfig(({ command }) => ({
  base: './',
  build: {
    sourcemap: true,
  },
  plugins: [
    preact(),
    webExtension({
      browser: 'firefox',
      // Firefox is started by npm scripts / .scripts/firefox.ts, not the plugin.
      disableAutoLaunch: true,
      manifest: 'src/manifest.json',
      transformManifest(manifest) {
        if (command !== 'serve') {
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
    }),
    viteStaticCopy({
      targets: [
        {
          dest: 'assets',
          rename: { stripBase: true },
          src: 'assets/icon-{48,96}.png',
        },
        {
          dest: 'assets/icons',
          rename: { stripBase: true },
          src: 'src/components/svg-icon/assets/*.svg',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
}))
