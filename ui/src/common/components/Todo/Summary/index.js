import { connect } from 'react-redux'

import Summary from './presenter'

function mapStateToProps (state) {
  return {
    deletedTodos: new Set(state.todo.deleted)
  }
}

export default connect(mapStateToProps)(Summary)
