import { connect } from 'react-redux'

import {
  fetchOne,
  update
} from '../../../api.js'

import Admin from './presenter'

function mapStateToProps (state) {
  return { preferences: state.preference }
}

function mapDispatchToProps (dispatch) {
  return {
    retrievePreferences: fetchOne('Preference')(dispatch),
    updateUserPreference: (updates) => {
      return update('Preference')(dispatch)(null, updates)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
