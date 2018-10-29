import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Flex, {FlexItem} from '@instructure/ui-layout/lib/components/Flex'

export default class SharedWith extends Component {
  static propTypes = {
    contact: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      email: PropTypes.string.isRequired,
      contact_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      created_at: PropTypes.string.isRequired
    }).isRequired,
  }

  render () {
    const { contact } = this.props
    return (
      <Flex>
        <FlexItem shrink grow>
          {contact.email}
        </FlexItem>
        <FlexItem>
          {contact.created_at}
        </FlexItem>
      </Flex>
    )
  }
}
