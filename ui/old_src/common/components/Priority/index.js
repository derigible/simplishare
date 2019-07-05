import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import {Button} from '@instructure/ui-buttons'
import {View} from '@instructure/ui-layout'
import {Popover} from '@instructure/ui-overlays'
import {RadioInput,RadioInputGroup} from '@instructure/ui-forms'

import {ScreenReaderContent} from '@instructure/ui-a11y'
import { Text as Typography} from '@instructure/ui-elements'

import {IconArrowUpLine as IconHighPriority,IconArrowEndLine as IconMediumPriority,IconArrowDownLine as IconLowPriority} from '@instructure/ui-icons'



export default class Priority extends PureComponent {
  static propTypes = {
    changePriority: PropTypes.func.isRequired,
    priority: PropTypes.oneOf(['low', 'medium', 'high'])
  }

  static defaultProps = {
    priority: 'medium'
  }

  state = {
    showPopup: false
  }

  handleSelect = (_, value) => {
    this.props.changePriority(value)
    this.setState({ showPopup: false })
  }

  handleToggle = () => {
    this.setState({ showPopup: !this.state.showPopup })
  }

  handleClick = (e) => {
    e.stopPropagation()
    this.setState({ showPopup: true })
  }

  setButtonRef = (node) => {
    this.buttonRef = node
  }

  focus () {
    this.buttonRef.focus()
  }

  render () {
    const { priority } = this.props
    let Icon = IconMediumPriority
    let color = 'brand'
    if (priority === 'high') {
      Icon = IconHighPriority
      color = 'error'
    } else if (priority === 'low') {
      Icon = IconLowPriority
      color = 'success'
    }
    return (
      <Popover
        on="click"
        show={this.state.showPopup}
        onToggle={this.handleToggle}
        onClick={this.handleClick}
        onDismiss={this.handleDismiss}
        shouldCloseOnDocumentClick
        label="Set Priority"
      >
        <Popover.Trigger>
          <Button size="small" variant="icon" as="span" buttonRef={this.setButtonRef} margin="none x-small none none">
            <Typography color={color}>
              <span style={{position: 'relative'}}><Icon /></span>
            </Typography>
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <View padding="medium" display="block" as="form">
            <RadioInputGroup
              description={<ScreenReaderContent>Priority Selection Group</ScreenReaderContent>}
              value={priority}
              onChange={this.handleSelect}
              name="prioritySelection"
            >
              <RadioInput value="low" label={<Typography color="success"><IconLowPriority /></Typography>} />
              <RadioInput value="medium" label={<Typography color="brand"><IconMediumPriority /></Typography>} />
              <RadioInput value="high" label={<Typography color="error"><IconHighPriority /></Typography>} />
            </RadioInputGroup>
          </View>
        </Popover.Content>
      </Popover>
    )
  }
}
