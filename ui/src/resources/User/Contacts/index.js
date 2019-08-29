// @flow

import React from 'react'

import { Button } from '@instructure/ui-buttons'
import { Table } from '@instructure/ui-table'
import { Grid } from '@instructure/ui-layout'
import { View } from '@instructure/ui-layout'
import { Heading } from '@instructure/ui-elements'
import { Text } from '@instructure/ui-elements'
import { Modal } from '@instructure/ui-overlays'
import { CloseButton } from '@instructure/ui-buttons'
import { TextInput } from '@instructure/ui-text-input'

import { IconPlusLine } from '@instructure/ui-icons'

import StandardEditModal from '../../../components/StandardEditModal'

import type { Contact as ContactType } from '../record'

function AddButton ({openModal} : {openModal: any}) {
  return (
    <View as="div" textAlign="end">
      <Button variant="primary" icon={IconPlusLine}  margin="small" onClick={openModal}>
        Add Contact
      </Button>
    </View>
  )
}

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

const renderContacts = (contacts) => {
    if (contacts.length > 0) {
      const pending = contacts.filter(c => c.contact_id === 'pending')
      const not_pending = contacts.filter(c => c.contact_id !== 'pending')

      return (
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
      )
    } else {
      return (
        <View>
          No Contacts!
        </View>
      )
    }
  }

export default function Contacts ({contacts, addContact} : {contacts: Array<ContactType>, addContact: any}) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)
  const [email: string, setEmail: any] = React.useState('')

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
    <>
      <AddButton openModal={toggleModal} />
      <StandardEditModal
        onSave={
          () => {
            addContact(email)
              .then(() => setEmail(''), () => {})
            toggleModal()
          }
        }
        closeModal={toggleModal}
        modalOpen={modalOpen}
        modalTitle="Add Contact"
      >
        <TextInput renderLabel="Email" value={email} onChange={(_, value) => setEmail(value)} />
      </StandardEditModal>
      {renderContacts(contacts)}
    </>
  )
}
