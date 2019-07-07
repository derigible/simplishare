// @flow

import React from 'react'

import { Grid } from '@instructure/ui-layout'
import { View } from '@instructure/ui-layout'
import { Heading } from '@instructure/ui-elements'
import { Text } from '@instructure/ui-elements'

import type { Contact as ContactType } from '../type'

function Contact ({contact} : {contact: ContactType}) {
  return (
    <View as="div" margin="small none">
      <Grid>
        <Grid.Row>
          <Grid.Col>
            <View
              as="div"
              display="inline-block"
              margin="none small none none"
              padding="small"
              background="inverse"
            >
              Username
            </View>
            <Text size="large">{contact.username || 'pending'}</Text>
          </Grid.Col>
          <Grid.Col>
            <View
              as="div"
              display="inline-block"
              margin="none small none none"
              padding="small"
              background="inverse"
            >
              Email
            </View>
            <Text size="large">{contact.email}</Text>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </View>
  )
}

export default function Contacts ({contacts} : {contacts: Array<ContactType>}) {
  const pending = contacts.filter(c => !c.username)
  const not_pending = contacts.filter(c => c.username)

  return (
    <Grid>
      <Grid.Row>
        <Grid.Col>
          <Heading>Connected</Heading>
          {
            not_pending.map(c => (<Contact key={c.contact_id} contact={c} />))
          }
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          <Heading>Pending</Heading>
          {
            pending.map(c => (<Contact key={c.contact_id} contact={c} />))
          }
        </Grid.Col>
      </Grid.Row>
    </Grid>
  )
}
