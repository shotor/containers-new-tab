import { createRequire } from 'node:module'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import preact from '@preact/preset-vite'

const require = createRequire(import.meta.url)

// oxlint-disable-next-line import/no-default-export -- Vitest config entry
export default defineConfig({
  plugins: [preact()],
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
      { find: 'react', replacement: require.resolve('preact/compat') },
      { find: 'react-dom', replacement: require.resolve('preact/compat') },
      {
        find: 'react/jsx-dev-runtime',
        replacement: require.resolve('preact/jsx-dev-runtime'),
      },
      {
        find: 'react/jsx-runtime',
        replacement: require.resolve('preact/jsx-runtime'),
      },
    ],
  },
  test: {
    coverage: {
      exclude: ['src/**/*.test.*', 'src/vite-env.d.ts'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      provider: 'v8',
      reporter: ['text'],
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        inline: ['react-hook-form'],
      },
    },
    setupFiles: ['./test/setup.ts'],
  },
})
