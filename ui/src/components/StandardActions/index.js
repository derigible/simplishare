// @flow

import React from 'react'

import { Grid, View } from '@instructure/ui-layout'
import { Heading } from '@instructure/ui-elements'

import Archive from './Archive'
import Share from './Share'
import Preferences from './Preferences'

import type { VirtualEntity } from '../../resources/sharedTypes'

export default function StandardActions(
  {entity} : {entity: VirtualEntity}
) {
  return (
    <View as="div" margin="small none">
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
          </Grid.Row>
        </Grid>
      </View>
    </View>
  )
}
