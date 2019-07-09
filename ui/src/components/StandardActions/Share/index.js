// @flow

import React from 'react'

import { View } from '@instructure/ui-layout'
import { Button } from '@instructure/ui-buttons'
import { IconShareLine } from '@instructure/ui-icons'
import { Tooltip } from '@instructure/ui-overlays'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { Table } from '@instructure/ui-table'
import { Pill } from '@instructure/ui-elements'
import { Popover } from '@instructure/ui-overlays'
import { CheckboxGroup, Checkbox } from '@instructure/ui-forms'

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

export default function Share(
  {entity} : {entity: VirtualEntity}
) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
    <>
      <StandardEditModal
        closeModal={toggleModal}
        modalOpen={modalOpen}
        modalTitle={`Share ${entity.displayName}`}
      >
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
