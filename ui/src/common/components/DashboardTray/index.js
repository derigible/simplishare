import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actions from '../../../../actions'
import { fetchList } from '../../../../api'

import DashboardTray from './presenter'

function mapStateToProps (state) {
  return {
    endpointConfig: {
      path: 'events/bulk_create',
      model: 'User',
      attribute: 'csv_uploads',
      method: 'POST',
      host: process.env.API_HOST,
      protocol: process.env.API_PROTOCOL
    }
  }
}

function mapDispatchToProps (dispatch) {
  const successCallback = () => {
    dispatch(actions.unsetSpinnerOverlay())
    fetchList('Events', {fetchFunc: 'fetchEventsByPeriod'})(dispatch)()
  }
  return {
    acceptFile: bindActionCreators(actions.setSpinnerOverlay, dispatch),
    successfulSubmit: successCallback,
    rejectFile: () => { alert('Must be a .csv file') } // TODO change this when alert framework set up
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardTray)
