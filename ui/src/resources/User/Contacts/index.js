// @flow

import React from 'react'

import { Button } from '@instructure/ui-buttons'
import { Table } from '@instructure/ui-table'
import { Grid } from '@instructure/ui-layout'
import { View } from '@instructure/ui-layout'
import { Heading } from '@instructure/ui-elements'
import { Text } from '@instructure/ui-elements'

import { IconPlusLine } from '@instructure/ui-icons'

import type { Contact as ContactType } from '../type'

function ContactTable ({type, contacts} : {type: string, contacts: Array<ContactType>}) {
  return (
    <>
      <Heading>{type}</Heading>
      <Table
        caption={`${type} Contacts`}
        hover
      >
        <Table.Head>
          <Table.Row>
            <Table.RowHeader>Username</Table.RowHeader>
            <Table.RowHeader>Email</Table.RowHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {
            contacts.map(c => (
              <Table.Row key={c.email}>
                <Table.Cell>{c.username || 'Pending'}</Table.Cell>
                <Table.Cell>{c.email}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </>
  )
}

export default function Contacts ({contacts} : {contacts: Array<ContactType>}) {
  const addButton = () => (
    <View as="div" textAlign="end">
      <Button variant="primary" icon={IconPlusLine}  margin="small">
        Add Contact
      </Button>
    </View>
  )

  if (contacts.length > 0) {
    const pending = contacts.filter(c => !c.username)
    const not_pending = contacts.filter(c => c.username)

    return (
      <>
        {addButton()}
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <ContactTable type="Connected" contacts={not_pending} />
            </Grid.Col>
          </Grid.Row>
          {pending.length > 0
            ? <Grid.Row>
                <Grid.Col>
                  <ContactTable type="Pending" contacts={pending} />
                </Grid.Col>
              </Grid.Row>
            : null
          }
        </Grid>
      </>
    )
  } else {
    return (
      <>
        {addButton()}
        <View>
          No Contacts!
        </View>
      </>
    )
  }
}
