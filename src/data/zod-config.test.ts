import '@/data/zod-config'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

describe('zod-config', () => {
  it('enables jitless so Zod skips the eval probe under MV3 CSP', () => {
    expect(z.config().jitless).toBe(true)
  })
})
