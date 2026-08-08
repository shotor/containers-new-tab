import '@/data/zod-config'
import { afterEach } from 'vitest'
import { render } from 'preact'

afterEach(() => {
  render(null, document.body)
  document.body.replaceChildren()
})
