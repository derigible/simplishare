// @flow

import React from 'react'

import {Button} from '@instructure/ui-buttons'
import {DateTimeInput} from '@instructure/ui-forms'
import {Popover} from '@instructure/ui-overlays'
import {View} from '@instructure/ui-layout'
import {IconClockLine as IconClock} from '@instructure/ui-icons'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import { Tooltip } from '@instructure/ui-overlays'

import type { VirtualEntity } from '../../../resources/sharedTypes'

function invalidDateTimeMessage (rawDateValue, rawTimeValue) {
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

export default function Snooze({entity} : {entity: VirtualEntity}) {
  const [popoverOpen: boolean, setPopoverOpen] = React.useState(false)
  const [messages: Array<string>, setMessages] = React.useState([])
  const [datetime: string, setDatetime] = React.useState('')

  const onChange = (_, isoDate) => {
    const now = new Date()
    const newValue = new Date(isoDate)
    if ( newValue.valueOf() <= now.valueOf()) {
      setMessages([{text: 'That date-time is in the past', type: 'hint'}])
    } else {
      setMessages([])
    }
    setDatetime(isoDate)
  }

  const onSave = (e) => {
    e.stopPropagation()
    entity.snooze(datetime)
    setPopoverOpen(!popoverOpen)
  }

  return (
    <Popover
      on="click"
      show={popoverOpen}
      onDismiss={() => setPopoverOpen(!popoverOpen)}
      shouldContainFocus
      shouldReturnFocus
      shouldCloseOnDocumentClick
      placement="top"
    >
      <Popover.Trigger>
        <Tooltip
          tip={`Snooze ${entity.displayName}`}
          placement="top"
        >
          <Button
            onClick={() => setPopoverOpen(!popoverOpen)}
            icon={IconClock}
            variant="icon"
          >
            <ScreenReaderContent>{`Snooze ${entity.displayName}`}</ScreenReaderContent>
          </Button>
        </Tooltip>
      </Popover.Trigger>
      <Popover.Content>
        <View padding="medium" as="div">
          <DateTimeInput
            description={<ScreenReaderContent>Pick a date and time</ScreenReaderContent>}
            datePlaceholder="Choose"
            dateLabel="Date"
            timeLabel="Time"
            datePreviousLabel="previous month"
            dateNextLabel="next month"
            onChange={onChange}
            layout="stacked"
            value={datetime}
            invalidDateTimeMessage={invalidDateTimeMessage}
            messages={messages}
            required
          />
          <Button onClick={onSave} variant="primary" margin="small none">
            Submit
          </Button>
        </View>
      </Popover.Content>
    </Popover>
  )
}
