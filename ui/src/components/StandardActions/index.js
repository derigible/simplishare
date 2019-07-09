// @flow

import React from 'react'

import { Grid, View } from '@instructure/ui-layout'
import { Heading } from '@instructure/ui-elements'
import { Tag } from '@instructure/ui-elements'
import {Popover} from '@instructure/ui-overlays'
import { IconAddLine } from '@instructure/ui-icons'
import { Select } from '@instructure/ui-select'
import { Button } from '@instructure/ui-buttons'
import { Tooltip } from '@instructure/ui-overlays'
import {ScreenReaderContent} from '@instructure/ui-a11y'

import Archive from './Archive'
import Share from './Share'
import Preferences from './Preferences'
import Snooze from './Snooze'

import type { VirtualEntity } from '../../resources/sharedTypes'

export default function StandardActions(
  {entity} : {entity: VirtualEntity}
) {
  const [popoverOpen: boolean, setPopoverOpen] = React.useState(false)

  return (
    <View as="div" margin="small none">
      <Heading level="h2">Tags</Heading>
      <View as="div" margin="small none" maxWidth="10rem">
        {
          entity.tags.map(t => (
            <Tag
              key={t.name}
              text={t.name}
              dismissible
              margin="0 xx-small 0 0"
              onClick={t.untag}
            />
          ))
        }
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
              tip={`Add Tag to ${entity.displayName}`}
              placement="top"
            >
              <Button
                onClick={() => setPopoverOpen(!popoverOpen)}
                icon={IconAddLine}
                variant="icon"
              >
                <ScreenReaderContent>{`Tag ${entity.displayName}`}</ScreenReaderContent>
              </Button>
            </Tooltip>
          </Popover.Trigger>
          <Popover.Content>
            Test
          </Popover.Content>
        </Popover>
      </View>
      <Heading level="h2">Additional Actions</Heading>
      <View as="div" margin="small none" maxWidth="10rem">
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <Archive entity={entity} />
            </Grid.Col>
            <Grid.Col>
              <Share entity={entity} />
            </Grid.Col>
            <Grid.Col>
              <Preferences entity={entity} />
            </Grid.Col>
            <Grid.Col>
              <Snooze entity={entity} />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </View>
    </View>
  )
}
