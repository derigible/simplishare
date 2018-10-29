import { connect } from 'react-redux'

import { create } from '../../../../api.js'

import TodoModal from './presenter'

function mapStateToProps (state, props) {
  let entity
  if (new URLSearchParams(window.location.search).get('isShared')) {
    entity = Object.values(state.todo.entities).find((entity) => entity.shared_object_id === props.todoId)
  } else {
    entity = state.todo.entities[props.todoId]
  }
  return {
    entity,
    possibleTags: [{label: 'Tags', options: Object.values(state.tag.tags)}]
  }
}


function mapDispatchToProps (dispatch) {
  return {
    createTag: create('Tag')(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoModal)
