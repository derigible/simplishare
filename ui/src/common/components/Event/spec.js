import Event from './presenter'
import { shallow } from 'enzyme'

describe('Event', () => {
  const props = {
    events: [{description: 'x'}, {description: 'y'}]
  }

  it('shows two elements', () => {
    const element = shallow(<Event { ...props } />)

    expect(element.find('.event')).to.have.length(2)
  })
})
