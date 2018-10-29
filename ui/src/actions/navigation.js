import * as actionTypes from '../constants/actionTypes'

// TODO: refactor this - it is totally wrong
export function navigateTo (path) {
  return function (dispatch) {
      dispatch({
        type: actionTypes.NAVIGATE_TO,
        payload: path
      })
    }
}

export function replacePath (path) {
  return function (dispatch) {
      dispatch({
        type: actionTypes.NAVIGATE_WITHOUT_ROUTING,
        payload: path
      })
    }
}

export function updatePath (path) {
  return {
    type: actionTypes.UPDATE_PATH,
    payload: path
  }
}
