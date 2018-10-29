import React, { Component } from 'react'
import PropTypes from 'prop-types'
import difference from 'lodash/difference'

import Button from '@instructure/ui-buttons/lib/components/Button'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Flex, { FlexItem } from '@instructure/ui-layout/lib/components/Flex'
import Heading from '@instructure/ui-elements/lib/components/Heading'
import Typography from '@instructure/ui-elements/lib/components/Text'

import IconEdit from '@instructure/ui-icons/lib/Line/IconEdit'
import IconEye from '@instructure/ui-icons/lib/Line/IconEye'

import SelectionManager from '../../../../common/components/SelectionManager'
import * as customPropTypes from '../../../../common/propTypes'
import Note from '../../Note/presenter'
import Delete from '../../../../common/components/Delete'
import Checkmark from '../../../../common/components/Checkmark'
import Priority from '../../../../common/components/Priority'

export default class NoteInList extends Component {
  static propTypes = {
    entity: Note.propTypes.entity,
    possibleTags: customPropTypes.possibleTags,
    deleteEntity: PropTypes.func.isRequired,
    updateEntity: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    readNote: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    createAndAddTag: PropTypes.func.isRequired,
    onSelectMenuOpenChange: PropTypes.func.isRequired
  }

  handleNoteEdit = () => {
    this.props.editNote(this.props.entity.id)
  }

  handleNoteRead = () => {
    this.props.readNote(this.props.entity.id)
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
    this.props.updateEntity(this.props.entity.id, updates)
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
    const { entity, possibleTags, onSelectMenuOpenChange } = this.props

    return (
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
              <Priority
                priority={entity.priority}
                changePriority={this.changePriority}
                ref={this.setPriorityRef}
              />
              <Button variant="icon" icon={IconEye} size="small" onClick={this.handleNoteRead}>
                <ScreenReaderContent>Read Note</ScreenReaderContent>
              </Button>
              <Button variant="icon" icon={IconEdit} size="small" onClick={this.handleNoteEdit}>
                <ScreenReaderContent>Edit Note</ScreenReaderContent>
              </Button>
              <Checkmark
                label="Archive Note"
                callback={this.handleArchiveNote}
              />
              <Delete
                label="Delete Note"
                callback={this.handleDelete}
              />
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem padding="xxx-small small">
          <SelectionManager
            possibleTags={possibleTags}
            onSelectTag={this.handleAddTag}
            onTagDefine={this.handleCreateAndAddTag}
            selectedTags={entity.tags}
            label="Tags"
            onMenuOpenChange={onSelectMenuOpenChange}
          />
        </FlexItem>
      </Flex>
    )
  }
}
