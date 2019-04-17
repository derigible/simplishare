import { connect } from 'react-redux'

import { archive } from '../../../../api'
import Archive from './presenter'

function mapDispatchToProps (dispatch) {
  return {
    archiveEntity: archive('Todo')(dispatch)
  }
}

export default connect(undefined, mapDispatchToProps, null, { withRef: true })(Archive)
