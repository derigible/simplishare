import * as actionTypes from '../constants/actionTypes'

const initialState = {
  entities: {},
  notesRetrieved: 'pending',
  deleted: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.NOTES_SET_NOTES:
      return setNotes(state, action.payload)
    case actionTypes.NOTES_SET_RETRIEVED:
      return { ...state, notesRetrieved: action.payload }
    case actionTypes.NOTES_REMOVE_NOTE:
      return removeNote(state, action.payload)
    case actionTypes.NOTES_SET_NOTE_SHARED_WITH:
      return setNoteSharedWith(state, action.payload)
    case actionTypes.NOTES_SET_NOTE_SHAREABLE_WITH:
      return setNoteShareableWith(state, action.payload)
  }
  return state
}

function setNotes (state, retrievedEntities) {
  const entities = {}
  retrievedEntities.forEach((entity) => {
    entities[entity.id] = Object.assign({}, state.entities[entity.id] || {}, entity)
  })
  return { ...state, entities: { ...state.entities, ...entities } }
}

function setNoteSharedWith (state, data) {
  const entity = Object.assign({}, state.entities[data.id] || {}, {sharedWith: data.data})
  return { ...state, entities: { ...state.entities, [data.id]: entity } }
}

function setNoteShareableWith (state, data) {
  const entity = Object.assign({}, state.entities[data.id] || {}, {shareableWith: data.data})
  return { ...state, entities: { ...state.entities, [data.id]: entity } }
}

function removeNote (state, payload) {
  return { ...state, deleted: state.deleted.concat([payload.id]) }
}
