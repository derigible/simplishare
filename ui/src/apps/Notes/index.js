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
import { recordParams } from '../../resources/Note/record'

import type { User as UserType } from '../../resources/User/record'
import { Note as NoteRecord } from '../../resources/Note/record'
import type { Note as NoteRecordType } from '../../resources/Note/record'
import type { ComponentActionType } from '../../constants/actionTypes'

function reducer(state: any, action: ComponentActionType) {
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
  {user, notes, createNote} : {user: UserType, notes: Array<NoteRecordType>, createNote: any}
) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)
  const [notesList: Array<NoteRecordType>, setNotesList] = React.useState(notes)
  const [noteObj: any, setNoteChanges] = React.useReducer(reducer, {})

  const toggleModal = () => setModalOpen(!modalOpen)

  if (notes.length > 1 && notesList.length === 0) {
    setNotesList(notes)
  }

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
            createNote(noteObj, (note: NoteRecordType) => setNotesList(notesList.concat(note)))
            toggleModal()
            setNoteChanges({type: 'body', payload: ''})
            setNoteChanges({type: 'title', payload: ''})
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
          onChange={(e) => setNoteChanges({type: 'body', payload: e.target.value})}
          autogrow
          resize="both"
        />
      </StandardEditModal>
      <List variant="unstyled" delimiter="dashed" >
        {notesList.map(t => <List.Item key={t.id} margin="small none"><Note note={t} /></List.Item>)}
      </List>
    </Page>
  )
}
