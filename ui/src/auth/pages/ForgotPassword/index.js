import { connect } from 'react-redux'

import ForgotPassword from './presenter'

import { navigateTo, submitForgotEmail, setAlertMessage } from '../../../actions'

function mapStateToProps (state) {
  const email = state.auth.user && state.auth.user.email
  return { email }
}

function mapDispatchToProps (dispatch) {
  return {
    goToLogin: () => {
      dispatch(navigateTo('/auth'))
      dispatch(setAlertMessage('An email has been sent to your email inbox. Follow the instructions before logging in.'))
    },
    submitEmail: submitForgotEmail(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
