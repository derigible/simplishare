import { connect } from 'react-redux'

import { update } from '../../../../api'
import SubTask from './presenter'

function mapStateToProps (state) {
  return {
    deletedTodos: new Set(state.todo.deleted)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateEntity: update('Todo')(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubTask)
