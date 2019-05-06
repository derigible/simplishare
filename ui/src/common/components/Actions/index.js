import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Popover, { PopoverTrigger, PopoverContent } from '@instructure/ui-overlays/lib/Popover'
import View from '@instructure/ui-layout/lib/View'
import Button from '@instructure/ui-buttons/lib/Button'
import ScreenReaderContent from '@instructure/ui-a11y/lib/ScreenReaderContent'

import IconMore from '@instructure/ui-icons/lib/IconMoreLine'

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
        <PopoverTrigger>
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
        </PopoverTrigger>
        <PopoverContent>
          <View padding="medium" as="div">
            {children}
          </View>
        </PopoverContent>
      </Popover>
    )
  }
}
