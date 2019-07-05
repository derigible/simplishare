import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {Alert} from '@instructure/ui-alerts'
import {Link, Text as Typography} from '@instructure/ui-elements'

import {themeable} from '@instructure/ui-themeable'

import styles from './styles.css'
import theme from './theme'
import LoginFields from '../../components/LoginFields'

class Authenticate extends Component {
  static propTypes = {
    alertMessage: PropTypes.string,
    goToForgotPassword: PropTypes.func.isRequired,
    submitCredentials: PropTypes.func.isRequired,
    submitRegistration: PropTypes.func.isRequired,
    email: PropTypes.string
  }

  static defaultProps = {
    alertMessage: null
  }

  state = {
    registering: new URLSearchParams(window.location.search).has('registering'),
    renderRegistrationSuccessful: false
  }

  setRegistration = () => {
    this.setState({registering: !this.state.registering})
  }

  setRegistrationSuccessful = () => {
    this.setState({ renderRegistrationSuccessful: true })
  }

  setLoginFieldsRef = (node) => {
    this.loginFields = node
  }

  goToForgotPassword = () => {
    this.props.goToForgotPassword(this.loginFields.email)
  }

  renderAlert () {
    const { alertMessage } = this.props
    if (!alertMessage) { return <div className={styles.placeHolder}>&nbsp;</div> }
    return <Alert
      variant="error"
      margin="small"
      timeout={3000}
    >
      {alertMessage}
    </Alert>
  }

  renderRegisterSuccessfulAlert () {
    const { renderRegistrationSuccessful } = this.state
    if (!renderRegistrationSuccessful) { return <div className={styles.placeHolder}>&nbsp;</div> }
    return <Alert
      variant="info"
      margin="small"
      timeout={3000}
    >
      Registration Successful. Please Check Email to confirm Registration before logging in.
    </Alert>
  }

  renderForgotPassword () {
    return <div className={styles.toRegisterWrapper}>
      <Typography size="x-small">Forgot password?&nbsp;
        <Link onClick={this.goToForgotPassword}>
          Click here
        </Link>
      </Typography>
    </div>
  }

  renderRegister () {
    if (!this.state.registering) {
      return <div className={styles.toRegisterWrapper}>
        <Typography size="x-small">Not a member?&nbsp;
          <Link onClick={this.setRegistration}>
            Click here to Register
          </Link>
        </Typography>
      </div>
    }
    return <div className={styles.toLoginWrapper}>
      <Typography size="x-small">
        <Link onClick={this.setRegistration}>
          Click here to Login
        </Link>
      </Typography>
    </div>
  }

  render () {
    return <div className={styles.center}>
      <div className={styles.formWrapper}>
        {this.renderAlert()}
        {this.renderRegisterSuccessfulAlert()}
        <form>
          <LoginFields
            ref={this.setLoginFieldsRef}
            isRegistering={this.state.registering}
            submitCredentials={this.state.registering ? this.props.submitRegistration : this.props.submitCredentials}
            email={this.props.email}
            onSubmitSuccessful={this.setRegistrationSuccessful}
          />
        </form>
        {this.renderRegister()}
        {this.renderForgotPassword()}
      </div>
    </div>
  }
}

export default themeable(theme, styles)(Authenticate)
