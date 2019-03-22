import React, { Component } from 'react'
import PropTypes from 'prop-types'
import difference from 'lodash/difference'
import keycode from 'keycode'

import Button from '@instructure/ui-buttons/lib/components/Button'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Flex, { FlexItem } from '@instructure/ui-layout/lib/components/Flex'
import Heading from '@instructure/ui-elements/lib/components/Heading'
import Pill from '@instructure/ui-elements/lib/components/Pill'
import Typography from '@instructure/ui-elements/lib/components/Text'

import IconEdit from '@instructure/ui-icons/lib/Line/IconEdit'
import IconEye from '@instructure/ui-icons/lib/Line/IconEye'

import * as customPropTypes from '../../../../common/propTypes'
import Note from '../../Note/presenter'
import Delete from '../../../../common/components/Delete'
import Checkmark from '../../../../common/components/Checkmark'
import Priority from '../../../../common/components/Priority'
import Actions from '../../../../common/components/Actions'
import View from '@instructure/ui-layout/lib/components/View'
import Snooze from '../../../../common/components/Snooze'

export default class NoteInList extends Component {
  static propTypes = {
    entity: Note.propTypes.entity,
    possibleTags: customPropTypes.possibleTags,
    deleteEntity: PropTypes.func.isRequired,
    archiveEntity: PropTypes.func.isRequired,
    updateEntity: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    readNote: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    createAndAddTag: PropTypes.func.isRequired
  }

  handleNoteEdit = () => {
    this.props.editNote(this.props.entity.id)
  }

  handleNoteRead = () => {
    this.props.readNote(this.props.entity.id)
  }

  handleKONoteRead = e => {
    if (keycode.isEventKey(e, 'enter')) this.handleNoteRead()

  }

  handleDelete = () => {
    this.props.deleteEntity(this.props.entity.id)
  }

  handleArchiveNote = () => {
    const updates = { archived: !this.props.entity.archived }
    if (!this.props.entity.sharedOn && this.props.entity.shared) {
      if (confirm('Do you want to mark archived for all users?')) {
        updates.update_shared = true
      }
    }
    this.props.archiveEntity(this.props.entity.id, updates)
  }

  handleCreateAndAddTag = (name) => {
    this.props.createAndAddTag(this.props.entity.id, name)
  }

  handleAddTag = (tag_ids) => {
    const { entity, removeTag, addTag } = this.props
    const diff = difference(entity.tags, tag_ids)
    if (diff.length > 0 && entity.tags.length > 0) {
      removeTag(entity.id, diff)
    } else {
      addTag(entity.id, tag_ids)
    }
  }

  changePriority = (priority) => {
    this.props.updateEntity(this.props.entity.id, { priority })
  }

  setPriorityRef = (node) => {
    this.priorityRef = node
  }

  focus () {
    this.priorityRef.focus()
  }

  render () {
    const { entity, possibleTags } = this.props

    return (
      <div
        onClick={this.handleNoteRead}
        role="button"
        tabIndex="0"
        onKeyDown={this.handleKONoteRead}
        style={{cursor: 'pointer'}}
      >
        <Flex direction="column">
          <FlexItem padding="x-small xxx-small">
            { entity.archived
              ? <Heading><s>{entity.title || 'Untitled Note'}</s></Heading>
              : <Heading>{entity.title || 'Untitled Note'}</Heading>
            }
          </FlexItem>
          <FlexItem padding="xxx-small small">
            <Flex padding="xxx-small none">
              <FlexItem shrink grow>
                <Typography>
                  {entity.body.length > 100 ? `${entity.body.slice(0, 100)} ...` : entity.body}
                </Typography>
              </FlexItem>
              <FlexItem>
                <Actions>
                  <View as="div" margin="0 0 small 0">
                    <Priority
                      priority={entity.priority}
                      changePriority={this.changePriority}
                      ref={this.setPriorityRef}
                    />
                  </View>
                  <View as="div" margin="0 0 small 0">
                    <Button variant="icon" icon={IconEye} size="small" onClick={this.handleNoteRead}>
                      <ScreenReaderContent>Read Note</ScreenReaderContent>
                    </Button>
                  </View>
                  <View as="div" margin="0 0 small 0">
                    <Snooze
                      entityType="Note"
                      entityId={entity.id}
                    />
                  </View>
                  <View as="div" margin="0 0 small 0">
                    <Button variant="icon" icon={IconEdit} size="small" onClick={this.handleNoteEdit}>
                      <ScreenReaderContent>Edit Note</ScreenReaderContent>
                    </Button>
                  </View>
                  <View as="div" margin="0 0 small 0">
                    <Checkmark
                      label="Archive Note"
                      callback={this.handleArchiveNote}
                    />
                  </View>
                  <View as="div">
                    <Delete
                      label="Delete Note"
                      callback={this.handleDelete}
                    />
                  </View>
                </Actions>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem padding={entity.tags.length > 0 ? "small" : 'none'}>
            {
              entity.tags.map((t) => {
                const tag = possibleTags[0].options.find((pt) => pt.id === t)
                if (tag) {
                  return <Pill key={tag.id} text={tag.name} margin="0 small 0 0" />
                }
              })
            }
          </FlexItem>
        </Flex>
      </div>
    )
  }
}
