import * as actionTypes from '../constants/actionTypes'

const initialState = {
  entities: {},
  todosRetrieved: 'pending',
  deleted: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.TODOS_SET_TODOS:
      return setTodos(state, action.payload)
    case actionTypes.TODOS_SET_RETRIEVED:
      return { ...state, todosRetrieved: action.payload }
    case actionTypes.TODOS_REMOVE_TODO:
      return removeTodo(state, action.payload)
    case actionTypes.TODOS_SET_TODO_SHARED_WITH:
      return setTodoSharedWith(state, action.payload)
    case actionTypes.TODOS_SET_TODO_SHAREABLE_WITH:
      return setTodoShareableWith(state, action.payload)
  }
  return state
}

function setTodos (state, retrievedEntities) {
  const entities = {}
  retrievedEntities.forEach((entity) => {
    entities[entity.id] = Object.assign({}, state.entities[entity.id] || {}, entity)
  })
  return { ...state, entities: { ...state.entities, ...entities } }
}

function setTodoSharedWith (state, data) {
  const entity = Object.assign({}, state.entities[data.id] || {}, {sharedWith: data.data})
  return { ...state, entities: { ...state.entities, [data.id]: entity } }
}

function setTodoShareableWith (state, data) {
  const entity = Object.assign({}, state.entities[data.id] || {}, {shareableWith: data.data})
  return { ...state, entities: { ...state.entities, [data.id]: entity } }
}

function removeTodo (state, payload) {
  return { ...state, deleted: state.deleted.concat([payload.id]) }
}
