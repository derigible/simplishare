import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Heading from '@instructure/ui-elements/lib/Heading'
import Typography from '@instructure/ui-elements/lib/Text'
import LoginFields from '../../components/LoginFields'
import View from '@instructure/ui-layout/lib/View'

export default class ResetPassword extends Component {
  static propTypes = {
    goToLogin: PropTypes.func.isRequired,
    submitResetPassword: PropTypes.func.isRequired,
    email: PropTypes.string
  }

  handleSubmitCredentials = (data) => {
    return this.props.submitResetPassword(
      data,
      () => {this.props.goToLogin()},
      e => { throw e }
    )
  }

  render () {
    return (
      <View
        as="div"
        margin="auto"
        maxWidth="40rem"
      >
        <Heading level="h1">Reset Password</Heading>
        <Typography>
          Reset your password by entering your email and new password. Then confirm the password and click submit.
        </Typography>
        <form>
          <LoginFields
            email={this.props.email}
            submitCredentials={this.handleSubmitCredentials}
            isRegistering
            submitText="Submit"
          />
        </form>
      </View>
    )
  }
}
