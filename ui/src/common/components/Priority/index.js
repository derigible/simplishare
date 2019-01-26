import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Button from '@instructure/ui-buttons/lib/components/Button'
import View from '@instructure/ui-layout/lib/components/View'
import Popover, { PopoverTrigger, PopoverContent } from '@instructure/ui-overlays/lib/components/Popover'
import RadioInput from '@instructure/ui-forms/lib/components/RadioInput'
import RadioInputGroup from '@instructure/ui-forms/lib/components/RadioInputGroup'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Typography from '@instructure/ui-elements/lib/components/Text'

import IconHighPriority from '@instructure/ui-icons/lib/Line/IconArrowUp'
import IconMediumPriority from '@instructure/ui-icons/lib/Line/IconArrowEnd'
import IconLowPriority from '@instructure/ui-icons/lib/Line/IconArrowDown'

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
        <PopoverTrigger>
          <Button size="small" variant="icon" as="span" buttonRef={this.setButtonRef} margin="none x-small none none">
            <Typography color={color}>
              <span style={{position: 'relative'}}><Icon /></span>
            </Typography>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
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
        </PopoverContent>
      </Popover>
    )
  }
}
