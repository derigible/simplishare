import * as actionTypes from '../constants/actionTypes'
import api_client, { createFetchMethod } from '../api_client'

const post = createFetchMethod('POST')

export function setAuthTokens (data) {
  return {
    type: actionTypes.SET_AUTH_TOKEN,
    payload: data[0]
  }
}

export function setUserInfo (data) {
  return {
    type: actionTypes.SET_USER_INFO,
    payload: data
  }
}

export function setAlertMessage (message) {
  return {
    type: actionTypes.SET_AUTH_ALERT_MESSAGE,
    payload: message
  }
}

export function logout (successCallback = (data) => data, errorCallback = (data) => data) {
  return function (dispatch) {
    return api_client.delete('logout')
      .then(successCallback, errorCallback)
      .then(()=> {return dispatch({ type: actionTypes.AUTH_LOGOUT })})

  }
}

export const submitForgotEmail = (dispatch) => {
  return function (credParams, successCallback = (data) => data, errorCallback = (data) => data) {
    const { username } = credParams
    return post(
      'forgot_password',
      {
        requestBody: {
          user: {
            email: username
          }
        },
        beforeFetch: () => {}
      }
    )
    .then(successCallback, errorCallback)
  }
}

function getResetToken () {
  return new URLSearchParams(window.location.search).get('reset_token')
}

export const submitResetPassword = (dispatch) => {
  return function (credParams, successCallback = (data) => data, errorCallback = (data) => data) {
    const { email, password, password_confirmation } = credParams
    return post(
      'reset_password',
      {
        requestBody: {
          user: {
            email,
            password,
            password_confirmation,
            reset_password_token: getResetToken()
          }
        },
        beforeFetch: () => {}
      }
    )
    .then(successCallback, errorCallback)
  }
}

export const submitUserCredentials = (credParams, successCallback, errorCallback) => {
  return function (dispatch) {
    const { email, password } = credParams
    return post(
      'login',
      {
        requestBody: {
          user: {
            email,
            password
          }
        },
        beforeFetch: () => {}
      }
    )
    .then(successCallback, errorCallback)
  }
}

export const createUser = (userCreateParams, successCallback, errorCallback) => {
  return function (dispatch) {
    return post(
      'users',
      {
        requestBody: {
          user: userCreateParams
        }
      }
    )
    .then(successCallback, errorCallback)
  }
}
