import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Button from '@instructure/ui-buttons/lib/components/Button'
import DateTimeInput from '@instructure/ui-forms/lib/components/DateTimeInput'
import Popover, { PopoverTrigger, PopoverContent } from '@instructure/ui-overlays/lib/components/Popover'
import View from '@instructure/ui-layout/lib/components/View'
import IconClock from '@instructure/ui-icons/lib/Line/IconClock'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'

import * as customPropTypes from '../../propTypes'

export default class Snooze extends PureComponent {
  handleCallback = (e) => {
    e.stopPropagation()
    this.props.snooze(this.props.entityType)(this.props.entityId, this.state.value)
    this.hidePopover()
  }

  state = {
    showPopover: false,
    messages: [],
    value: undefined
  }

  showPopover = () => {
    this.setState({showPopover: true})
  }

  hidePopover = () => {
    this.setState({showPopover: false})
  }

  onChange = (e, isoDate) => {
    const now = new Date()
    const newValue = new Date(isoDate)
    let messages = []
    if ( newValue.valueOf() <= now.valueOf()) {
      messages = [{text: 'That date-time is in the past', type: 'hint'}]
    }
    this.setState({ value: isoDate, messages })
  }

  invalidDateTimeMessage (rawDateValue, rawTimeValue) {
    if (rawDateValue) {
      return `'${rawDateValue}' is not a valid date.`
    } else {
      if (rawTimeValue) {
        return 'You must provide a date with a time.'
      } else {
        return 'Date and time values are required.'
      }
    }
  }

  render () {
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
            icon={IconClock}
            variant="icon"
            size="small"
            as="span"
          >
            <ScreenReaderContent>{this.props.label}</ScreenReaderContent>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <View padding="medium" as="div">
            <DateTimeInput
              description={<ScreenReaderContent>Pick a date and time</ScreenReaderContent>}
              datePlaceholder="Choose"
              dateLabel="Date"
              timeLabel="Time"
              datePreviousLabel="previous month"
              dateNextLabel="next month"
              onChange={this.onChange}
              layout="stacked"
              value={this.state.value}
              invalidDateTimeMessage={this.invalidDateTimeMessage}
              messages={this.state.messages}
              required
            />
            <Button onClick={this.handleCallback} variant="primary" margin="small none">
              Submit
            </Button>
          </View>
        </PopoverContent>
      </Popover>
    )
  }
}

Snooze.propTypes = {
  entityId: customPropTypes.id,
  entityType: PropTypes.string.isRequired,
  snooze: PropTypes.func.isRequired,
  label: PropTypes.string
}

Snooze.defaultProps = {
  label: 'Snooze Until'
}
