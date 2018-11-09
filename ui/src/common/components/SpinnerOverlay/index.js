import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Mask from '@instructure/ui-overlays/lib/components/Mask'
import Overlay from '@instructure/ui-overlays/lib/components/Overlay'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'

export default class Summary extends Component {
  static propTypes = {
    open: PropTypes.bool
  }

  showDefaultFocus = () => {
    return this.srcREf
  }

  setSrcRef = (node) => {
    this.srcREf = node
  }

  render () {
    return <Overlay
      open={this.props.open}
      transition="fade"
      label="Overlay Example"
      defaultFocusElement={this.showDefaultFocus}
      shouldReturnFocus
    >
      <Mask>
        <ScreenReaderContent ref={this.setSrcRef}>Waiting for Upload to Complete.</ScreenReaderContent>
        <Spinner title="Loading" size="large" />
      </Mask>
    </Overlay>
  }
}