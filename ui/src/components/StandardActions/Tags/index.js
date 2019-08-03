// @flow

import React from 'react'

import { Responsive, View } from '@instructure/ui-layout'
import { Tag } from '@instructure/ui-elements'
import {Popover} from '@instructure/ui-overlays'
import { Button } from '@instructure/ui-buttons'
import { Tooltip } from '@instructure/ui-overlays'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import { IconAddLine, IconTagLine } from '@instructure/ui-icons'


import StandardAutocomplete from '../../Select/StandardAutocomplete'
import StandardEditModal from '../../StandardEditModal'
import { Tag as TagRecord } from '../../../resources/baseRecords'

import type { VirtualEntity } from '../../../resources/baseRecords'

function createTagsAsOptions(tags: Array<Tag>) {
  return tags.map(t => ({id: t.id, label: t.name, disabled: false}))
}

function filterUsedTags(tags: any, usedTags: Array<Tag>) {
  const allTagsMap = {...tags}
  // eslint-disable-next-line
  usedTags.forEach(t => allTagsMap[t.id] && delete allTagsMap[t.id])

  return Object.values(allTagsMap)
}

function createOption(rerender: any, setTagId: any) {
  return function (name: string) {
    TagRecord.createTag(name, rerender)
      .then(data => setTagId(data.id))
  }
}

function LargeTagAdd ({entity, rerender} : {entity: VirtualEntity, rerender: any}) {
  const [popoverOpen: boolean, setPopoverOpen] = React.useState(false)
  const [tagId: ?string, setTagId: any] = React.useState('')

  const togglePopover = () => setPopoverOpen(!popoverOpen)

  return (
    // eslint-disable-next-line
    <div onKeyDown={e => { e.stopPropagation() }} style={{display: 'inline-block'}}>
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
          <View as="div" padding="medium">
            <StandardAutocomplete
              options={createTagsAsOptions(filterUsedTags(TagRecord.tags(), entity.tags))}
              setSelected={setTagId}
              iconBefore={IconTagLine}
              label={<ScreenReaderContent>Tag</ScreenReaderContent>}
              onOptionCreate={createOption(rerender, setTagId)}
              ignoreOptionCreateValues={entity.tags.map(t => t.name)}
            />
            <Button
              variant="primary"
              onClick={() => {entity.tag({tagId, rerender}); togglePopover()}}
              margin="small none none none"
            >
              Tag
            </Button>
          </View>
        </Popover.Content>
      </Popover>
    </div>
  )
}

function SmallTagAdd({entity, rerender} : {entity: VirtualEntity, rerender: any}) {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [tagId, setTagId] = React.useState('')

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
    // eslint-disable-next-line
    <div onKeyDown={e => {e.stopPropagation()}} style={{display: 'inline-block'}}>
      <StandardEditModal
        closeModal={toggleModal}
        modalOpen={modalOpen}
        onSave={() => {entity.tag({tagId, rerender}); toggleModal()}}
        modalTitle={`Tag ${entity.displayName}`}
        submitDisabled={tagId === null}
      >
        <StandardAutocomplete
          options={createTagsAsOptions(filterUsedTags(TagRecord.tags(), entity.tags))}
          setSelected={setTagId}
          label={<ScreenReaderContent>Tag</ScreenReaderContent>}
          iconBefore={IconTagLine}
          onOptionCreate={createOption(rerender, setTagId)}
          ignoreOptionCreateValues={entity.tags.map(t => t.name)}
        />
      </StandardEditModal>
      <Button
        onClick={toggleModal}
        icon={IconAddLine}
        variant="icon"
      >
        <ScreenReaderContent>{`Tag ${entity.displayName}`}</ScreenReaderContent>
      </Button>
    </div>
  )
}

export default function Tags({entity} : {entity: VirtualEntity}) {
  const [toggle, setRerender] = React.useState(false)
  const rerender = () => setRerender(!toggle)

  return (
    <View as="div" margin="small none">
      {
        entity.tags.map(t => (
          <Tag
            key={t.name}
            text={t.name}
            dismissible
            margin="0 xx-small 0 0"
            onClick={t.untag(rerender)}
          />
        ))
      }
      <Responsive
        match="media"
        query={{
          small: { maxWidth: 600 },
          large: { minWidth: 600 }
        }}
      >
        {(props, matches) => {
          if (matches.includes('large')) {
            return <LargeTagAdd entity={entity} rerender={rerender} />
          } else {
            return <SmallTagAdd entity={entity} rerender={rerender} />
          }
        }}
      </Responsive>
    </View>
  )
}
