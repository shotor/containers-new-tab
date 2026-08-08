import '@/data/zod-config'
import '@/main.css'
import { applyResolvedTheme, resolveTheme } from '@/theme'
import { App } from '@/components/app'
import { render } from 'preact'

// Avoid flash before storage loads (system preference; storage may override).
applyResolvedTheme(resolveTheme('system'))

const root = document.getElementById('app')

if (root) {
  render(<App />, root)
}
