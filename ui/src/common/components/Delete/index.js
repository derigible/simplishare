import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import {Button} from '@instructure/ui-buttons'

import {IconTrash} from '@instructure/ui-icons'
import {ScreenReaderContent} from '@instructure/ui-a11y'

export default class Delete extends PureComponent {
  handleCallback = (e) => {
    e.stopPropagation()
    this.props.callback(e)
  }

  render () {
    return (
      <Button
        onClick={this.handleCallback}
        variant="icon"
        size="small"
        as="span"
        icon={IconTrash}
      >
        <ScreenReaderContent>{this.props.label}</ScreenReaderContent>
      </Button>
    )
  }
}

Delete.propTypes = {
  callback: PropTypes.func.isRequired,
  label: PropTypes.string
}

Delete.defaultProps = {
  label: 'Delete Todo'
}
