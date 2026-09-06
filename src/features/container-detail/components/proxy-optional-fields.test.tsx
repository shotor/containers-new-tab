import { describe, expect, it } from 'vitest'

import { ProxyOptionalFields } from '@/features/container-detail/components/proxy-optional-fields'
import type { ContainerDetailFormValues } from '@/features/container-detail/container-detail.schema'

import { renderSnapshot, stubRegister } from '@/test/render-snapshot'

const register = stubRegister<ContainerDetailFormValues>()

describe('ProxyOptionalFields', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<ProxyOptionalFields register={register} />),
    ).toMatchSnapshot()
  })
})
