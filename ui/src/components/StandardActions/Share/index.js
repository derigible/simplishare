// @flow

import React from 'react'

import { View } from '@instructure/ui-layout'
import { Button } from '@instructure/ui-buttons'
import { IconShareLine, IconAddLine } from '@instructure/ui-icons'
import { Tooltip } from '@instructure/ui-overlays'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { Table } from '@instructure/ui-table'
import { Pill } from '@instructure/ui-elements'
import { Popover } from '@instructure/ui-overlays'
import { CheckboxGroup, Checkbox } from '@instructure/ui-forms'
import { Pages } from '@instructure/ui-pages'

import StandardEditModal from '../../StandardEditModal'
import ClickableDiv from '../../ClickableDiv'

import type { VirtualEntity } from '../../../resources/sharedTypes'
import type { SharedWithContact } from '../../../resources/User/type'

const accessSettings = ['read', 'edit', 'archive', 'destroy', 'share']

function renderAccess(contact: SharedWithContact) {
  const [showPopover, setShowPopover] = React.useState(false)

  const togglePopover = () => setShowPopover(!showPopover)

  return (
    <Popover
      on="click"
      show={showPopover}
      onDismiss={togglePopover}
      shouldContainFocus
      shouldReturnFocus
      shouldCloseOnDocumentClick
      label="Set Share Preferences"
    >
      <Popover.Trigger>
        <ClickableDiv
          onClick={togglePopover}
        >
          {contact.access.map(access => <Pill key={access} text={access} margin="x-small" />)}
        </ClickableDiv>
      </Popover.Trigger>
      <Popover.Content>
        <View as="div" margin="small">
          <CheckboxGroup
            name="access_settings"
            description="Manage Access Settings"
          >
            {accessSettings.map(a => (
              <Checkbox
                key={a}
                variant="toggle"
                label={a}
                checked={contact.access.includes(a)}
                onChange={() => contact.changeAcess(a)}
              />
            ))}
          </CheckboxGroup>
        </View>
      </Popover.Content>
    </Popover>
  )
}

function PageOne ({entity, nextPage}, {entity: VirtualEntity, nextPage: any}) {
  return (
    <>
      <Table
        caption="Manage Shared Settings"
        hover
      >
        <Table.Head>
          <Table.Row>
            <Table.RowHeader>Username</Table.RowHeader>
            <Table.RowHeader>Email</Table.RowHeader>
            <Table.RowHeader>Access</Table.RowHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {
            entity.sharedWith.map(sw => (
              <Table.Row key={sw.id}>
                <Table.Cell>{sw.username || 'Pending'}</Table.Cell>
                <Table.Cell>{sw.email}</Table.Cell>
                <Table.Cell>{renderAccess(sw)}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
      <Button icon={IconAddLine} variant="primary" onClick={nextPage} margin="small none">Add User</Button>
    </>
  )
}

function PageTwo ({entity, back}, {entity: VirtualEntity, back: any}) {
  const [userId: ?string, setUserId: any] = React.useState(null)
  const [perms: Array<string>, setPerms: any] = React.useState([])

  return (
    <>
      hello
      <View as="div" textAlign="end">
        <Button onClick={back} margin="small">Cancel</Button>
        <Button
          disabled={!!userId}
          onClick={() => {entity.shareWith(userId, perms); setUserId(null); setPerms([]); back()}}
          variant="primary"
          margin="small none"
        >
          Share
        </Button>
      </View>
    </>
  )
}

export default function Share(
  {entity} : {entity: VirtualEntity}
) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)
  const [page: number, setPage] = React.useState(0)

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
    <>
      <StandardEditModal
        closeModal={toggleModal}
        modalOpen={modalOpen}
        modalTitle={`Share ${entity.displayName}`}
      >
        <Pages
          activePageIndex={page}
          onPageIndexChange={setPage}
          backButtonLabel="Back to shared settings"
        >
          <Pages.Page>
            {(_, _2) => (<PageOne entity={entity} nextPage={() => setPage(1)} />)}
          </Pages.Page>
          <Pages.Page>
            {(_, navigateToPreviousPage) => (<PageTwo entity={entity} back={navigateToPreviousPage} />)}
          </Pages.Page>
        </Pages>
      </StandardEditModal>
      <Tooltip
        tip={`Share Settings for ${entity.displayName}`}
        placement="top"
      >
        <Button
          variant="icon"
          icon={IconShareLine}
          onClick={toggleModal}
        >
          <ScreenReaderContent>{`Share ${entity.displayName}`}</ScreenReaderContent>
        </Button>
      </Tooltip>
    </>
  )
}
