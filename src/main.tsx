import '@/main.css'

import { render } from 'preact'

import { App } from '@/components/app'

import '@/data/zod-config'

import { applyResolvedTheme, resolveTheme } from '@/theme'

// Avoid flash before storage loads (system preference; storage may override).
applyResolvedTheme(resolveTheme('system'))

const root = document.getElementById('app')

if (root) {
  render(<App />, root)
}
