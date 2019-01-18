import { connect } from 'react-redux'

import Authenticate from './presenter'

import { navigateTo, setUserInfo } from '../../../actions'
import { fetchOne, create } from '../../../api'
import getAppData from '../../../api_client/hydrator'

function mapStateToProps (state) {
  const alertMessage = state.auth.alertMessage || (window.location.search ? null : 'Uh oh! You need to log in!')
  const email = state.auth.user && state.auth.user.email
  return { alertMessage, email }
}

function mapDispatchToProps (dispatch) {
  return {
    goToForgotPassword: (email) => {
      dispatch(navigateTo('/auth/forgotPassword'))
      dispatch(setUserInfo({ email }))
    },
    submitCredentials: (credParams) => {
      fetchOne('AuthToken', {fetchFunc: 'submitUserCredentials', errorMessage: 'Credentials incorrect. Please enter valid credentials.'})(dispatch)(credParams)
        .then((data) => {
          const redirectTo = window.location.search.split('=')[1] || 'todos'
          getAppData(dispatch, redirectTo)
          navigateTo(redirectTo)(dispatch)
        })
    },
    submitRegistration: create('User', {setFunc: 'setUserInfo'})(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
