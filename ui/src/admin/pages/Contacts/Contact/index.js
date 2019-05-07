import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {Flex} from '@instructure/ui-layout'

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
        <Flex.Item shrink grow>
          {contact.email}
        </Flex.Item>
        <Flex.Item>
          {contact.created_at}
        </Flex.Item>
      </Flex>
    )
  }
}
