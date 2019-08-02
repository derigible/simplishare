// @flow

import React from 'react'

import { Heading } from '@instructure/ui-elements'
import { View } from '@instructure/ui-layout'
import { Button } from '@instructure/ui-buttons'
import { IconLtiLine } from '@instructure/ui-icons'
import { Tooltip } from '@instructure/ui-overlays'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { Table } from '@instructure/ui-table'
import { capitalizeFirstLetter } from '@instructure/ui-utils'
import { RadioInputGroup,RadioInput } from '@instructure/ui-forms'

import StandardEditModal from '../../StandardEditModal'
import ClickableDiv from '../../ClickableDiv'

import type { VirtualEntity, Preference } from '../../../resources/baseRecords'

function renderPreference(type: string, preference: Preference, entityType: string, rerender: any) {
  const entityActionPreferences = preference[entityType]

  return (
    <View as="div" key={type}>
      <Heading level="h3" margin="none none small none">{capitalizeFirstLetter(type)}</Heading>
      <Table
        caption="Manage Preferences"
        hover
      >
        <Table.Head>
          <Table.Row>
            <Table.RowHeader>Notify On</Table.RowHeader>
            <Table.RowHeader textAlign="center">When</Table.RowHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {
            Object.keys(entityActionPreferences).map(p => {
              const pref = entityActionPreferences[p]

              return (
                <Table.Row key={p}>
                  <Table.Cell>{capitalizeFirstLetter(p)}</Table.Cell>
                  <Table.Cell>
                    <RadioInputGroup
                      size="medium"
                      variant="toggle"
                      name={p}
                      value={pref.type}
                      onChange={(_,  value) => {pref.setPreference(value, rerender)}}
                      description={<ScreenReaderContent>Set {type} Preference for {entityType} on {p}</ScreenReaderContent>}
                    >
                      <RadioInput
                        label="Always"
                        value="always"
                        context="success"
                      />
                      <RadioInput
                        label="Not Set"
                        value="not_set"
                        context="off"
                      />
                      <RadioInput
                        label="Never"
                        value="never"
                        context="danger"
                      />
                    </RadioInputGroup>
                  </Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table.Body>
      </Table>
    </View>
  )
}

export default function Preferences(
  {entity} : {entity: VirtualEntity}
) {
  const [modalOpen: boolean, setModalOpen: any] = React.useState(false)
  const [toggle: boolean, setRerender: any] = React.useState(false)

  const toggleModal = () => setModalOpen(!modalOpen)
  const rerender = () => setRerender(!toggle)

  return (
    <>
      <StandardEditModal
        closeModal={toggleModal}
        modalOpen={modalOpen}
        modalTitle={`Manage ${entity.displayName} Preferences`}
      >
        {Object.keys(entity.preferences).map(notficationType => renderPreference(notficationType, entity.preferences[notficationType], entity.type, rerender))}
      </StandardEditModal>
      <Tooltip
        tip={`Preferences for ${entity.displayName}`}
        placement="top"
      >
        <Button
          variant="icon"
          icon={IconLtiLine}
          onClick={toggleModal}
        >
          <ScreenReaderContent>{`Preferences for ${entity.displayName}`}</ScreenReaderContent>
        </Button>
      </Tooltip>
    </>
  )
}
