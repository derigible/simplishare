import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {Button} from '@instructure/ui-buttons'
import {FormFieldGroup} from '@instructure/ui-form-field'
import {TextInput} from '@instructure/ui-forms'
import themeable from '@instructure/ui-themeable'

import styles from './styles.css'
import theme from './theme'

const defaultConfirmErrors = {
  passwordConfirm: [],
  password: [],
  email: [],
  username: []
}

class LoginFields extends Component {
  static propTypes = {
    isRegistering: PropTypes.bool,
    isLogin: PropTypes.bool,
    submitCredentials: PropTypes.func.isRequired,
    email: PropTypes.string,
    onSubmitSuccessful: PropTypes.func,
    submitText: PropTypes.string
  }

  static defaultProps = {
    onSubmitSuccessful: () => {},
    submitRegistration: () => {},
    email: '',
    isLogin: true,
    isRegistering: false,
    submitText: null
  }

  constructor (props) {
    super(props)

    this.state = {
      email: props.email,
      username: '',
      password: '',
      passwordConfirm: '',
      hasSubmitted: false,
      confirmErrors: Object.assign({}, defaultConfirmErrors)
    }
  }

  confirmErrors = {
    passwordConfirm: [{text: 'Password confirmation must match original password', type: 'error'}],
    password: [{text: 'Password cannot be blank', type: 'error'}],
    email: [{text: 'Email must be valid', type: 'error'}],
    username: [{text: 'Username cannot be blank', type: 'error'}]
  }

  get submitText () {
    if (this.props.submitText) { return this.props.submitText }
    if (!this.props.isLogin) { return 'Submit' }
    return this.props.isRegistering ? 'Register' : 'Login'
  }

  get email () {
    return this.state.email
  }

  submit = (e) => {
    e.preventDefault()
    if (!this.props.isLogin) {
      this.props.submitCredentials(
        {
          email: this.state.email
        }
      )
    }
    else if (!this.props.isRegistering) {
      const creds = {
        email: this.state.email,
        password: this.state.password
      }
      this.props.submitCredentials(creds)
    } else {
      if (this.checkValidity()) {
        const creds = {
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
          password_confirmation: this.state.passwordConfirm,
        }
        const invitation_code = new URLSearchParams(window.location.search).get('invitation_code')
        if (invitation_code) {
          creds.invitation_code = invitation_code
        }
        this.props.submitCredentials(creds)
          .then(() => {
            this.resetLogin()
            this.props.onSubmitSuccessful()
          })
      } else {
        this.setState({
          hasSubmitted: true
        })
      }
    }
  }

  resetLogin = () => {
    this.setState({
      hasSubmitted: false,
      confirmErrors: defaultConfirmErrors,
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    })
  }

  checkValidity = () => {
    const errors = Object.assign({}, defaultConfirmErrors)
    if (this.doesEmailHaveErrors(this.state.email)) {
      errors.email = this.confirmErrors.email
    }
    if (this.doesPasswordHaveErrors(this.state.password)) {
      errors.password = this.confirmErrors.password
    }
    if (this.doesPasswordConfirmHaveErrors(this.state.passwordConfirm)) {
      errors.passwordConfirm = this.confirmErrors.passwordConfirm
    }
    if (this.doesUsernameHaveErrors(this.state.username)) {
      errors.username = this.confirmErrors.username
    }
    this.setState({ confirmErrors: errors })
    return Object.values(errors).every((v) => v.length === 0 )
  }

  doesPasswordConfirmHaveErrors = (passwordConfirm) => passwordConfirm !== this.state.password

  doesEmailHaveErrors = (email) => email.length === 0

  doesPasswordHaveErrors = (password) =>  password.length === 0

  doesUsernameHaveErrors = (username) => username.length === 0

  handleUsernameChange = (e) => {
    this.doTheChange('username', e.target.value, this.doesUsernameHaveErrors)
  }

  handleEmailChange = (e) => {
    this.doTheChange('email', e.target.value, this.doesEmailHaveErrors)
  }

  handlePasswordChange = (e) => {
    this.doTheChange('password', e.target.value, this.doesPasswordHaveErrors)
  }

  handlePasswordConfirmChange = (e) => {
    this.doTheChange('passwordConfirm', e.target.value, this.doesPasswordConfirmHaveErrors)
  }

  doTheChange = (type, value, checkIfErrors) => {
    this.setState({ [type]: value })
    if (checkIfErrors(value)) {
      this.setErrors(type)
      return
    }
    if (this.state.confirmErrors[type].length !== 0) {
      this.setState({confirmErrors: { ...this.state.confirmErrors, ...{ [type]: [] } }})
    }
  }

  setErrors = (type) => {
    if (this.state.confirmErrors[type].length === 0) {
      this.setState({
        confirmErrors: {
          ...this.state.confirmErrors,
          ...{ [type]: this.confirmErrors[type] }
        }
      })
    }
  }

  getErrors (errors) {
    return this.state.hasSubmitted
      ? this.state.confirmErrors[errors]
      : []
  }

  render () {
    return (
      <FormFieldGroup
        description="User Credentials"
        layout="stacked"
        rowSpacing="large"
      >
        {
          this.props.isRegistering
            ? <TextInput
              label="Username"
              type="text"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              messages={this.getErrors('username')}
            />
            : null
        }
        <TextInput
          label="Email"
          type="email"
          value={this.state.email}
          onChange={this.handleEmailChange}
          messages={this.getErrors('email')}
        />
        {
          this.props.isLogin
            ? <TextInput
              label="Password"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              messages={this.getErrors('password')}
            />
            : null
        }
        {
          this.props.isRegistering
            ? <TextInput
              label="Password Confirm"
              type="password"
              value={this.state.passwordConfirm}
              onChange={this.handlePasswordConfirmChange}
              messages={this.getErrors('passwordConfirm')}
            />
            : null
        }
        <div className={styles.submitButtonWrapper}>
          <Button type="submit" onClick={this.submit}>
            {this.submitText}
          </Button>
        </div>
      </FormFieldGroup>
    )
  }
}

export default themeable(theme, styles)(LoginFields)
