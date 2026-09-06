import { describe, expect, it } from 'vitest'
import * as z from 'zod/mini'

import '@/data/zod-config'

describe('zod-config', () => {
  it('enables jitless so Zod skips the eval probe under MV3 CSP', () => {
    expect(z.config().jitless).toBe(true)
  })
})
