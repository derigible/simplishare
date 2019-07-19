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
import { defaultNote } from '../../resources/Note/record'



function reducer(state: NoteRecordType, action: ComponentActionType) {
  switch (action.type) {
    case 'body':
      return new NoteRecord(recordParams(state, {body: action.payload}));
    case 'title':
      return new NoteRecord(recordParams(state, {body: action.payload}))
    default:
      throw new Error();
  }
}

export default function Notes (
  {user, notes} : {user: UserType, notes: Array<NoteRecordType>}
) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)
  const [noteObj: NoteRecordType, setNoteChanges] = React.useReducer(reducer, defaultNote)

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
        {notes.map(t => <List.Item key={t.id} margin="small none"><Note note={t} /></List.Item>)}
      </List>
    </Page>
  )
}
