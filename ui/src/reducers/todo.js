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
    case actionTypes.TODOS_REMOVE_TODO:
      return removeTodo(state, action.payload.id)
    case actionTypes.TODOS_SET_RETRIEVED:
      return { ...state, todosRetrieved: action.payload }
    case actionTypes.TODOS_SET_TODO_SHARED_WITH:
      return setTodoSharedWith(state, action.payload)
    case actionTypes.TODOS_SET_TODO_SHAREABLE_WITH:
      return setTodoShareableWith(state, action.payload)
  }
  return state
}

function setTodos (state, tds) {
  const entities = {}
  tds.forEach((todo) => {
    entities[todo.id] = Object.assign({}, state.entities[todo.id] || {}, todo)
  })
  return { ...state, entities: { ...state.entities, ...entities } }
}

function removeTodo (state, id) {
  return { ...state, deleted: state.deleted.concat([id]) }
}

function setTodoSharedWith (state, data) {
  const todo = Object.assign({}, state.entities[data.id] || {}, {sharedWith: data.data})
  return { ...state, entities: { ...state.entities, [data.id]: todo } }
}

function setTodoShareableWith (state, data) {
  const todo = Object.assign({}, state.entities[data.id] || {}, {shareableWith: data.data})
  return { ...state, entities: { ...state.entities, [data.id]: todo } }
}
