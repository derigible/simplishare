import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { NOTES_SET_NOTES } from '../../../constants/actionTypes'

import List from '../../../common/components/List'
import Note from '../Note/presenter'
import NoteInList from './NoteInList'
import WithSidebar from '../../../common/components/WithSidebar'
import SharedTagSelectionManager from '../../../common/components/SharedTagSelectionManager'

export default class NotesList extends Component {
  static propTypes = {
    deletedNotes: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]
      )
    ).isRequired,
    notes: PropTypes.arrayOf(Note.propTypes.entity),
    notesRetrieved: PropTypes.oneOf(['success', 'inProgress', 'pending', 'error']),
    populateNotes: PropTypes.func.isRequired,
    startNoteCreate: PropTypes.func.isRequired
  }

  get filteredNotes () {
    return this.props.notes.filter(note => !this.props.deletedNotes.includes(note.id))
  }

  render () {
    const { startNoteCreate, notesRetrieved, populateNotes } = this.props
    return <WithSidebar
    content={<div>
      <SharedTagSelectionManager />
    </div>}
  >
    <List
      entities={this.filteredNotes}
      entitiesRetrieved={notesRetrieved}
      populateEntities={populateNotes}
      startAddEntity={startNoteCreate}
      startAddEntityLabel="Add Note"
      componentType={NoteInList}
      tagEntityActionType={NOTES_SET_NOTES}
      quickCreateEntity={()=>{}}
    />
  </WithSidebar>
  }
}
