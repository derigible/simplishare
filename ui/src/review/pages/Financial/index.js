import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actions from '../../../../actions'
import Record from '../../../../records/Event'
import { fetchList } from '../../../../api.js'

import Financial from './presenter'

function mapStateToProps (state) {
  const events = Object.values(state.event.entities).map((e) => new Record(e, state))
  const { filterBy, eventsRetrieved, lookup_term, lookup_param } = state.dashboard
  const { categoriesRetrieved } = state.category
  const { spinnerOverlay } = state.fileUpload
  return { events, filterBy, eventsRetrieved, categoriesRetrieved, lookup_term, lookup_param, spinnerOverlay }
}

function mapDispatchToProps (dispatch) {
  return {
    setLookupParam: bindActionCreators(actions.setLookupParam, dispatch),
    setFilterBy: bindActionCreators(actions.setFilterBy, dispatch),
    setLookupTerm: bindActionCreators(actions.setLookupTerm, dispatch),
    populateCategories: fetchList('Categories')(dispatch),
    populateEvents: fetchList('Events', {fetchFunc: 'fetchEventsByPeriod'})(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Financial)
