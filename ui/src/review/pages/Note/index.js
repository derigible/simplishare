import { connect } from 'react-redux'

import {
  fetchOne,
  update,
  create,
  tagEntity,
  removeTag,
} from '../../../api.js'
import { navigateTo } from '../../../actions'

import Note from './presenter'

function mapStateToProps (state, props) {
  return {
    entity: state.note.entities[parseInt(props.id, 10)] || { id: props.id, needToLoad: true },
    possibleTags: [{label: 'Tags', options: Object.values(state.tag.tags)}],
    selectedTags: state.tag.selectedTags
  }
}


function mapDispatchToProps (dispatch, props) {
  return {
    populateNote: () => fetchOne('Note')(dispatch)(props.id),
    updateNote: update('Note')(dispatch),
    createNote: create('Note')(dispatch),
    endNoteEdit: () => navigateTo('/notes')(dispatch),
    switchNoteView: (view) => navigateTo(`/notes/${view}/${props.id}`)(dispatch),
    createTag: create('Tag')(dispatch),
    tagEntity: tagEntity(dispatch),
    removeTag: removeTag(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Note)
