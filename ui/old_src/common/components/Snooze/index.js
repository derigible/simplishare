import { connect } from 'react-redux'

import { snooze } from '../../../api'
import ListView from './presenter'

function mapDispatchToProps (dispatch) {
  return {
    snooze: (entityType) => snooze(entityType)(dispatch),
  }
}

export default connect(undefined, mapDispatchToProps, null, { withRef: true })(ListView)
