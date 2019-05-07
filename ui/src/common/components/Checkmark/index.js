import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import {Button} from '@instructure/ui-buttons'

import {IconCheck} from '@instructure/ui-icons'
import {ScreenReaderContent} from '@instructure/ui-a11y'

export default class Checkmark extends PureComponent {
  handleCallback = (e) => {
    e.stopPropagation()
    this.props.callback(e)
  }

  focus () {
    this.buttonRef.focus();
  }

  setButtonRef = node => this.buttonRef = node;

  render () {
    return (
      <Button icon={IconCheck} buttonRef={this.setButtonRef} onClick={this.handleCallback} variant="icon" size="small" as="span">
        <ScreenReaderContent>{this.props.label}</ScreenReaderContent>
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
