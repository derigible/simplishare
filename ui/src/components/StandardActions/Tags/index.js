// @flow

import React from 'react'

import { Responsive, View } from '@instructure/ui-layout'
import { Tag } from '@instructure/ui-elements'
import {Popover} from '@instructure/ui-overlays'
import { Button } from '@instructure/ui-buttons'
import { Tooltip } from '@instructure/ui-overlays'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import { IconAddLine } from '@instructure/ui-icons'


import StandardAutocomplete from '../../Select/StandardAutocomplete'
import StandardEditModal from '../../StandardEditModal'

import type { VirtualEntity } from '../../../resources/baseRecords'

function AddPopover ({entity} : {entity: VirtualEntity}) {
  const [popoverOpen: boolean, setPopoverOpen] = React.useState(false)
  const [tagId: ?string, setTagId: any] = React.useState('')

  const togglePopover = () => setPopoverOpen(!popoverOpen)

  return (
    <Popover
      on="click"
      show={popoverOpen}
      onDismiss={togglePopover}
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
            onClick={togglePopover}
            icon={IconAddLine}
            variant="icon"
          >
            <ScreenReaderContent>{`Tag ${entity.displayName}`}</ScreenReaderContent>
          </Button>
        </Tooltip>
      </Popover.Trigger>
      <Popover.Content>
        <View as="div" padding="small">
          <StandardAutocomplete
            options={entity.tagsAsOptions}
            setSelected={setTagId}
          />
          <Button variant="primary" onClick={() => {entity.tag(tagId); togglePopover()}} margin="small">
            Tag
          </Button>
        </View>
      </Popover.Content>
    </Popover>
  )
}

export default function Tags({entity} : {entity: VirtualEntity}) {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [tagId, setTagId] = React.useState('')

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
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
      <Responsive
        match="media"
        query={{
          small: { maxWidth: 600 },
          large: { minWidth: 600}
        }}
      >
        {(props, matches) => {
          if (matches.includes('large')) {
            return <AddPopover entity={entity} />
          } else {
            return (
              <>
                <StandardEditModal
                  closeModal={toggleModal}
                  modalOpen={modalOpen}
                  onSave={() => {entity.tag(tagId); toggleModal()}}
                  modalTitle={`Tag ${entity.displayName}`}
                  submitDisabled={tagId === null}
                >
                  <StandardAutocomplete
                    options={entity.tagsAsOptions}
                    setSelected={setTagId}
                  />
                </StandardEditModal>
                <Button
                  onClick={toggleModal}
                  icon={IconAddLine}
                  variant="icon"
                >
                  <ScreenReaderContent>{`Tag ${entity.displayName}`}</ScreenReaderContent>
                </Button>
              </>
            )
          }
        }}
      </Responsive>
    </View>
  )
}
