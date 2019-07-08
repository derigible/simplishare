// @flow

import React from 'react'

import { List } from '@instructure/ui-elements'
import { Button } from '@instructure/ui-buttons'
import { IconPlusLine } from '@instructure/ui-icons'
import { TextArea } from '@instructure/ui-forms'
import { TextInput } from '@instructure/ui-text-input'

import Page from '../../components/Page'
import StandardEditModal from '../../components/StandardEditModal'
import Note from '../../resources/Note'

import type { UserType } from '../../resources/User/type'
import type { Note as NoteType } from '../../resources/Note/type'
import type { ComponentActionType } from '../../constants/actionTypes'
import { defaultNote } from '../../resources/Note/type'

function reducer(state: NoteType, action: ComponentActionType) {
  switch (action.type) {
    case 'body':
      return {...state, body: action.payload};
    case 'title':
      return {...state, title: action.payload}
    default:
      throw new Error();
  }
}

export default function Notes (
  {user, notes} : {user: UserType, notes: Array<NoteType>}
) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)
  const [noteObj: NoteType, setNoteChanges] = React.useReducer(reducer, defaultNote)

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
    <Page
      user={user}
      pageName="notes"
    >
      <Button variant="primary" icon={IconPlusLine}  margin="small" onClick={toggleModal}>
        Add Note
      </Button>
      <StandardEditModal
        onSave={
          () => {
            user.addEntity('note', noteObj)
            toggleModal()
          }
        }
        closeModal={toggleModal}
        modalOpen={modalOpen}
        modalTitle="Add Note"
        size="fullscreen"
      >
        <TextInput renderLabel="Title" value={noteObj.title} onChange={(_, value) => setNoteChanges({type: 'title', payload: value})} />
        <TextArea
          label="Body"
          value={noteObj.body}
          onChange={(_, value) => setNoteChanges({type: 'body', payload: value})}
          autogrow
          resize="both"
        />
      </StandardEditModal>
      <List variant="unstyled" delimiter="dashed" >
        {notes.map(t => <List.Item key={t.id}><Note note={t} /></List.Item>)}
      </List>
    </Page>
  )
}
