// @flow

import React from 'react'
import keycode from 'keycode'

import { View } from '@instructure/ui-layout'
import { ToggleGroup } from '@instructure/ui-toggle-details'
import { IconXSolid, IconPlusSolid } from '@instructure/ui-icons'
import { Text } from '@instructure/ui-elements'
import { TextArea } from '@instructure/ui-forms'
import { TextInput } from '@instructure/ui-text-input'

import StandardEditModal from '../../components/StandardEditModal'
import StandardActions from '../../components/StandardActions'
import ClickableDiv from '../../components/ClickableDiv'

import type { Note as NoteType } from './record'
import { Note as NoteRecord } from './record'
import type { ComponentActionType } from '../../constants/actionTypes'

export function recordParams (state: NoteType, newParam: any) {
  return Object.assign(
    {},
    {
      body: state.body,
      title: state.title,
      id: state.id,
      archived: state.archived,
      tags: state.tags,
      shared: state.shared,
      shared_on: state.shared_on,
      metadata: state.metadata,
      preferences: state.preferences,
      shared_object_id: state.shared_object_id,
      updated_at: state.updated_at,
      created_at: state.created_at,
      priority: state.priority
    },
    newParam
  )
}

function reducer(state: NoteType, action: ComponentActionType) {
  switch (action.type) {
    case 'title':
      return new NoteRecord(recordParams(state, {title: action.payload}))
    case 'body':
      return new NoteRecord(recordParams(state, {body: action.payload}))
    default:
      throw new Error();
  }
}

export default function Note ({note} : {note: NoteType}) {
  const [noteObj: NoteType, setNoteChanges] = React.useReducer(reducer, note)
  const [modalOpen: boolean, setModalOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState(!!note.expanded)

  const toggleModal = () => { setModalOpen(!modalOpen) }

  return (
    <ClickableDiv
      onClick={toggleModal}
    >
      <StandardEditModal
        onSave={
          () => {
            note.updateWith(noteObj)
            toggleModal()
          }
        }
        closeModal={toggleModal}
        modalOpen={modalOpen}
        modalTitle="Edit Note"
        size="fullscreen"
      >
        <TextInput
          renderLabel="Title"
          value={noteObj.title}
          onChange={(_, value) => setNoteChanges({type: 'title', payload: value})}
        />
        <TextArea
          label="Body"
          value={noteObj.body}
          onChange={(_, value) => setNoteChanges({type: 'body', payload: value})}
          autogrow
          resize="vertical"
          height="80vh"
        />
      </StandardEditModal>
      <Text size="xx-large">{note.title}</Text>
       <div
        onClick={e => e.stopPropagation()}
        role="button"
        tabIndex="-1"
        onKeyDown={(e) => { } }
      >
        <ToggleGroup
          toggleLabel="Toggle to edit details"
          summary="Edit Note Details"
          iconExpanded={IconXSolid}
          icon={IconPlusSolid}
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        >
          <View as="div" margin="small">
            <StandardActions
              entity={note}
            />
          </View>
        </ToggleGroup>
      </div>
    </ClickableDiv>
  )
}
