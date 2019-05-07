import React, { Component } from 'react'
import PropTypes from 'prop-types'
import difference from 'lodash/difference'
import keycode from 'keycode'

import {Button} from '@instructure/ui-buttons'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import {Flex} from '@instructure/ui-layout'
import {Heading, Pill, Text as Typography} from '@instructure/ui-elements'

import {IconEdit} from '@instructure/ui-icons'
import {IconEye} from '@instructure/ui-icons'

import * as customPropTypes from '../../../../common/propTypes'
import Note from '../../Note/presenter'
import Delete from '../../../../common/components/Delete'
import Checkmark from '../../../../common/components/Checkmark'
import Actions from '../../../../common/components/Actions'
import {View} from '@instructure/ui-layout'
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
          <Flex.Item padding="x-small xxx-small">
            { entity.archived
              ? <Heading><s>{entity.title || 'Untitled Note'}</s></Heading>
              : <Heading>{entity.title || 'Untitled Note'}</Heading>
            }
          </Flex.Item>
          <Flex.Item padding="xxx-small small">
            <Flex padding="xxx-small none">
              <Flex.Item shrink grow>
                <Typography>
                  {entity.body.length > 100 ? `${entity.body.slice(0, 100)} ...` : entity.body}
                </Typography>
              </Flex.Item>
              <Flex.Item>
                <Actions>
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
              </Flex.Item>
            </Flex>
          </Flex.Item>
          <Flex.Item padding={entity.tags.length > 0 ? "small" : 'none'}>
            {
              entity.tags.map((t) => {
                const tag = possibleTags[0].options.find((pt) => pt.id === t)
                if (tag) {
                  return <Pill key={tag.id} text={tag.name} margin="0 small 0 0" />
                }
              })
            }
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
