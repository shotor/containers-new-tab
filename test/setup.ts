import { render } from 'preact'
import { afterEach, vi } from 'vitest'

import '@/data/zod-config'

vi.stubGlobal('browser', {
  runtime: {
    getURL: (path: string) => `moz-extension://test/${path}`,
  },
})

afterEach(() => {
  render(null, document.body)
  document.body.replaceChildren()
})
