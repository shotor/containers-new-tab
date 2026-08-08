import '@/data/zod-config'
import { afterEach, vi } from 'vitest'
import { render } from 'preact'

vi.stubGlobal('browser', {
  runtime: {
    getURL: (path: string) => `moz-extension://test/${path}`,
  },
})

afterEach(() => {
  render(null, document.body)
  document.body.replaceChildren()
})
