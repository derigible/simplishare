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

import type { Note as NoteType } from './type'
import type { ComponentActionType } from '../../constants/actionTypes'

function reducer(state: NoteType, action: ComponentActionType) {
  switch (action.type) {
    case 'title':
      return {...state, title: action.payload};
    case 'body':
      return {...state, body: action.payload}
    default:
      throw new Error();
  }
}

export default function Note ({note} : {note: NoteType}) {
  const [noteObj: NoteType, setNoteChanges] = React.useReducer(reducer, note)
  const [modalOpen: boolean, setModalOpen] = React.useState(false)

  const toggleModal = () => { setModalOpen(!modalOpen) }

  return (
    <div
      onClick={toggleModal}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => { if (keycode.isEventKey(e, 'enter')) toggleModal() } }
      style={{cursor: 'pointer'}}
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
    </div>
  )
}
