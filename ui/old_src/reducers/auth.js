import * as actionTypes from '../constants/actionTypes'

const initialState = {
  alertMessage: null,
  accessToken: {},
  user: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_AUTH_TOKEN:
      return setAuthToken(state, action.payload)
    case actionTypes.SET_USER_INFO:
      return setUserData(state, action.payload)
    case actionTypes.SET_AUTH_ALERT_MESSAGE:
      return { ...state, ...{ alertMessage: action.payload }}
  }
  return state
}

function setAuthToken (state, data) {
  window.localStorage.setItem('accessToken', data.token)
  storeUserData(data)
  return { ...state, accessToken: data.token, user: data }
}

function setUserData (state, data) {
  storeUserData(data)
  return { ...state, user: data}
}

function storeUserData(data) {
  window.localStorage.setItem('userData', JSON.stringify(data))
}
