import * as actionTypes from '../constants/actionTypes'

const initialState = {
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.PREFERENCES_SET_PREFERENCES:
      return setPreferences(state, action.payload.preferences)
  }
  return state
}

function setPreferences (state, preferences) {
  const oldUserData = JSON.parse(window.localStorage.getItem('userData'))
  const newUserData = Object.assign({}, oldUserData, { preferences })
  window.localStorage.setItem('userData', JSON.stringify(newUserData))
  return { ...state, ...preferences }
}
