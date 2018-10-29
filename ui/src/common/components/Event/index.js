import Event from './presenter'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../actions'

function mapStateToProps (state) {
  const { shownEvent } = state.event
  return {
    shownEvent
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showMore: bindActionCreators(actions.eventShowMore, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Event)
