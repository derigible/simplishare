import * as actionTypes from '../constants/actionTypes'

export function navigateTo (path) {
  return function (dispatch) {
      dispatch({
        type: actionTypes.NAVIGATE_TO,
        payload: path
      })
    }
}
