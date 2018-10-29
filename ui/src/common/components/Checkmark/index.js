import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Button from '@instructure/ui-buttons/lib/components/Button'

import IconCheck from '@instructure/ui-icons/lib/Line/IconCheck'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'

export default class Checkmark extends PureComponent {
  handleCallback = (e) => {
    e.stopPropagation()
    this.props.callback(e)
  }

  render () {
    return (
      <Button onClick={this.handleCallback} variant="icon" size="small" as="span">
        <ScreenReaderContent>{this.props.label}</ScreenReaderContent>
        <IconCheck />
      </Button>
    )
  }
}

Checkmark.propTypes = {
  callback: PropTypes.func.isRequired,
  label: PropTypes.string
}

Checkmark.defaultProps = {
  label: 'Mark complete'
}
