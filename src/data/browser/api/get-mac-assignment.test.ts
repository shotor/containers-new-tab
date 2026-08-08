import { describe, expect, it, vi } from 'vitest'
import { getMacAssignment } from '@/data/browser/api/get-mac-assignment'

describe('getMacAssignment', () => {
  it('returns a narrowed assignment from MAC', async () => {
    const sendMessage = vi.fn<() => Promise<{ userContextId: string }>>(
      async () => ({ userContextId: '3' }),
    )
    vi.stubGlobal('browser', { runtime: { sendMessage } })

    await expect(getMacAssignment('https://example.com')).resolves.toEqual({
      userContextId: '3',
    })
    expect(sendMessage).toHaveBeenCalledWith('@testpilot-containers', {
      method: 'getAssignment',
      url: 'https://example.com',
    })
  })

  it('returns null when MAC is unavailable or the payload is invalid', async () => {
    vi.stubGlobal('browser', {
      runtime: {
        sendMessage: vi.fn<() => Promise<never>>(async () => {
          throw new Error('missing')
        }),
      },
    })
    await expect(getMacAssignment('https://example.com')).resolves.toBeNull()

    vi.stubGlobal('browser', {
      runtime: {
        sendMessage: vi.fn<() => Promise<{ nope: boolean }>>(async () => ({
          nope: true,
        })),
      },
    })
    await expect(getMacAssignment('https://example.com')).resolves.toBeNull()
  })

  it('coerces numeric userContextId from MAC', async () => {
    vi.stubGlobal('browser', {
      runtime: {
        sendMessage: vi.fn<() => Promise<{ userContextId: number }>>(
          async () => ({ userContextId: 3 }),
        ),
      },
    })

    await expect(getMacAssignment('https://example.com')).resolves.toEqual({
      userContextId: '3',
    })
  })
})
