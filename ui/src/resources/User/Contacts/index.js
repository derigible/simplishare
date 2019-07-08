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

import type { Contact as ContactType } from '../type'

function AddButton ({openModal} : {openModal: any}) {
  return (
    <View as="div" textAlign="end">
      <Button variant="primary" icon={IconPlusLine}  margin="small" onClick={openModal}>
        Add Contact
      </Button>
    </View>
  )
}

function AddContact ({addContact, closeModal, modalOpen} : {addContact: any, closeModal: any, modalOpen: boolean}) {
  const [email: string, setEmail: any] = React.useState('')

  const closeButton = () => (
    <CloseButton
      placement="end"
      offset="medium"
      variant="icon"
      onClick={closeModal}
    >
      Close
    </CloseButton>
  )
  return (
    <Modal
      open={modalOpen}
      onDismiss={closeModal}
      onSubmit={addContact}
      size="auto"
      label="Add Contact"
      shouldCloseOnDocumentClick
    >
      <Modal.Header>
        {closeButton()}
        <Heading>Add Contact</Heading>
      </Modal.Header>
      <Modal.Body>
        <TextInput renderLabel="Email" value={email} onChange={(_, value) => setEmail(value)} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>&nbsp;
        <Button variant="primary" type="submit" onClick={() => addContact(email)}>Submit</Button>
      </Modal.Footer>
    </Modal>
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

export default function Contacts ({contacts, addContact} : {contacts: Array<ContactType>, addContact: any}) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)

  const toggleModal = () => setModalOpen(!modalOpen)

  const renderContacts = () => {
    if (contacts.length > 0) {
      const pending = contacts.filter(c => !c.username)
      const not_pending = contacts.filter(c => c.username)

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

  return (
    <>
      <AddButton openModal={toggleModal} />
      <AddContact
        addContact={
          (email : string) => {
            addContact(email)
            toggleModal()
          }
        }
        closeModal={toggleModal}
        modalOpen={modalOpen}
      />
      {renderContacts()}
    </>
  )
}
