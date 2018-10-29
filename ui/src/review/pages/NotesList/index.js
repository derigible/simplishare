import { connect } from 'react-redux'

import { navigateTo } from '../../../actions'
import {
  fetchList
} from '../../../api.js'

import NotesList from './presenter'

function mapStateToProps (state) {
  return {
    deletedNotes: state.note.deleted,
    notes: Object.values(state.note.entities),
    notesRetrieved: state.note.notesRetrieved
  }
}

function mapDispatchToProps (dispatch) {
  return {
    populateNotes: fetchList('Notes')(dispatch),
    startNoteCreate: () =>  navigateTo('/notes/edit/newNote')(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesList)
