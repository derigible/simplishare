import { connect } from 'react-redux'

import {
  fetchList,
  create,
  update,
  tagEntity
} from '../../../api.js'
import { navigateTo } from '../../../actions'

import Todos from './presenter'

function mapStateToProps (state) {
  return {
    deletedTodos:new Set(state.todo.deleted),
    todos: Object.values(state.todo.entities),
    todosRetrieved: state.todo.todosRetrieved,
    selectedTags: state.tag.selectedTags,
    possibleTags: [{label: 'Tags', options: Object.values(state.tag.tags)}]
  }
}


function mapDispatchToProps (dispatch) {
  const createEntity = (todo, tag_ids) => {
    return create('Todo')(dispatch)(todo)
      .then((todoData) => {
        if (tag_ids && tag_ids.length > 0) {
          tagEntity(dispatch)(todoData, tag_ids)
        }
      })
  }
  const updateEntity = (id, todo, tag_ids) => {
    return update('Todo')(dispatch)(id, todo)
      .then((todoData) => {
        if (tag_ids && tag_ids.length > 0) {
          tagEntity(dispatch)(todoData, tag_ids)
        }
      })
  }
  return {
    createEntity,
    updateEntity,
    populateTodos: fetchList('Todos')(dispatch),
    navigateTo: (redirectTo) => navigateTo(redirectTo)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Todos)
