import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Popover, { PopoverTrigger, PopoverContent } from '@instructure/ui-overlays/lib/components/Popover'
import View from '@instructure/ui-layout/lib/components/View'
import Button from '@instructure/ui-buttons/lib/components/Button'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'

import IconMore from '@instructure/ui-icons/lib/Line/IconMore'

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
