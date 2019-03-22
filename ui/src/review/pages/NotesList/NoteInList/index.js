import { connect } from 'react-redux'

import { navigateTo } from '../../../../actions'
import { destroy, update, archive } from '../../../../api'
import NoteInList from './presenter'

function mapDispatchToProps (dispatch) {
  return {
    editNote: (id) => navigateTo(`/notes/edit/${id}`)(dispatch),
    readNote: (id) => navigateTo(`/notes/view/${id}`)(dispatch),
    deleteEntity: destroy('Note')(dispatch),
    archiveEntity: archive('Note')(dispatch),
    updateEntity: update('Note')(dispatch)
  }
}

// eslint-disable-next-line no-undefined
export default connect(undefined, mapDispatchToProps)(NoteInList)
