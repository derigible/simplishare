import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {Heading, Text as Typography} from '@instructure/ui-elements'

import LoginFields from '../../components/LoginFields'
import {View} from '@instructure/ui-layout'

export default class ForgotPassword extends Component {
  static propTypes = {
    goToLogin: PropTypes.func.isRequired,
    submitEmail: PropTypes.func.isRequired,
    email: PropTypes.string
  }

  handleSubmitCredentials = (data) => {
    return this.props.submitEmail(data)
      .then(() => this.props.goToLogin())
  }

  render () {
    return (
      <View
        as="div"
        margin="auto"
        maxWidth="40rem"
      >
        <Heading level="h1">Forgot Password</Heading>
        <Typography>
          Enter your email address and press submit. Then check your email for instructions
          on changing your password.
        </Typography>
        <form>
          <LoginFields
            isLogin={false}
            email={this.props.email}
            submitCredentials={this.handleSubmitCredentials}
          />
        </form>
      </View>
    )
  }
}
