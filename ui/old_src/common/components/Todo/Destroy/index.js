import { connect } from 'react-redux'

import { destroy } from '../../../../api'
import Destroy from './presenter'

function mapDispatchToProps (dispatch) {
  return {
    deleteEntity: destroy('Todo')(dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(Destroy)
