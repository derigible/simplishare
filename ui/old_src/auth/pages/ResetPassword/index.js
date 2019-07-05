import { connect } from 'react-redux'

import ResetPassword from './presenter'

import { navigateTo, submitResetPassword, setAlertMessage } from '../../../actions'

function mapStateToProps (state) {
  const email = state.auth.user && state.auth.user.email
  return { email }
}

function mapDispatchToProps (dispatch) {
  return {
    goToLogin: () => {
      dispatch(navigateTo('/auth'))
      dispatch(setAlertMessage('Your email has been successfully reset. You may now login.'))
    },
    submitResetPassword: submitResetPassword(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
