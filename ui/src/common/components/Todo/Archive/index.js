import { connect } from 'react-redux'

import { update } from '../../../../api'
import Archive from './presenter'

function mapDispatchToProps (dispatch) {
  return {
    updateEntity: update('Todo')(dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(Archive)
