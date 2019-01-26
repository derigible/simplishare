import React, { Component } from 'react'
import PropTypes from 'prop-types'
import View from '@instructure/ui-layout/lib/components/View'
import IconCopy from '@instructure/ui-icons/lib/Line/IconCopy'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Button from '@instructure/ui-buttons/lib/components/Button'
import { id } from '../../propTypes'

export default class ShareableLink extends Component {
  copyToClipboard = (e) => {
    this.copyRef.select()
    document.execCommand('copy')
  }

  setCopyRef = (node) => this.copyRef = node

  render () {
    const { entity, entityType } = this.props
    const urlParts = window.location
    const url = urlParts.protocol
      + '//'
      + urlParts.hostname
      + (urlParts.port.length > 0 ? `:${urlParts.port}` : '')
      + '#!'
      + entityType
      + '/view/'
      + entity.shared_object_id
      + '?isShared=true'
    return (
      <View
        as="div"
        margin="x-small none none none"
      >
        <input style={{width: '1px', height: '1px', border: 'none', position: 'absolute', top: '-999999px'}} ref={this.setCopyRef} value={url} readOnly/>
        Shareable Link: &nbsp;
        <Button icon={IconCopy} onClick={this.copyToClipboard} variant="icon">
          <ScreenReaderContent>Copy {entityType} link to clipboard.</ScreenReaderContent>
        </Button>
        &nbsp;
        {url}
      </View>
    )
  }
}

ShareableLink.propTypes = {
  entity: PropTypes.shape({
    shared_object_id: id
  }).isRequired,
  entityType: PropTypes.string.isRequired
}
