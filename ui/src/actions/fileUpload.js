import * as actionTypes from '../constants/actionTypes'

export function unsetSpinnerOverlay () {
  return {
    type: actionTypes.UNSET_SPINNER_OVERLAY
  }
}

export function setSpinnerOverlay () {
  return {
    type: actionTypes.SET_SPINNER_OVERLAY
  }
}
