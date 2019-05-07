import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import {Popover} from '@instructure/ui-overlays'
import {View} from '@instructure/ui-layout'
import {Button} from '@instructure/ui-buttons'
import {ScreenReaderContent} from '@instructure/ui-a11y'

import {IconMore} from '@instructure/ui-icons'

export default class Todo extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  state = {
    showPopover: false
  }

  showPopover = (e) => {
    e.stopPropagation()
    this.setState({showPopover: true})
  }

  hidePopover = () => {
    this.setState({showPopover: false})
  }

  render () {
    const { children } = this.props
    return (
      <Popover
        on="click"
        show={this.state.showPopover}
        onDismiss={this.hidePopover}
        shouldContainFocus
        shouldReturnFocus
        shouldCloseOnDocumentClick
        placement="start"
      >
        <Popover.Trigger>
          <Button
            onClick={this.showPopover}
            icon={IconMore}
            variant="icon"
            size="small"
            as="span"
            margin="0 small"
          >
            <ScreenReaderContent>Quick Actions</ScreenReaderContent>
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <View padding="medium" as="div">
            {children}
          </View>
        </Popover.Content>
      </Popover>
    )
  }
}
