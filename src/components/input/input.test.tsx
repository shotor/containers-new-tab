import { describe, expect, it } from 'vitest'
import { Input, Select } from '@/components/input/input'
import { renderSnapshot } from '@/test/render-snapshot'

describe('Input', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <Input id="name" type="text" placeholder="Name" value="Work" />,
      ),
    ).toMatchSnapshot()
  })
})

describe('Select', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <Select id="type" value="direct">
          <option value="direct">Direct</option>
          <option value="http">HTTP</option>
        </Select>,
      ),
    ).toMatchSnapshot()
  })
})
