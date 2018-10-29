import * as actionTypes from '../constants/actionTypes'

const initialState = {
  spinnerOverlay: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_SPINNER_OVERLAY:
      return { ...state, spinnerOverlay: true }
    case actionTypes.UNSET_SPINNER_OVERLAY:
      return { ...state, spinnerOverlay: false }
  }
  return state
}

