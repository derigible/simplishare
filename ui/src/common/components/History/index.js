import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setSortByKey } from '../../../actions'

import History from './presenter'

function mapStateToProps (state) {
  const { sortByKey, sortByReverse } = state.history
  return {
    sortByKey,
    sortByReverse
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSortKey: bindActionCreators(setSortByKey, dispatch)()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
