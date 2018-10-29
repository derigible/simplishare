import * as actionTypes from '../constants/actionTypes'

export function setSortByKey () {
  return function (dispatch) {
    return function (sortByKey) {
      return function () {
        dispatch({
          type: actionTypes.HISTORY_SET_SORT_BY_KEY,
          payload: sortByKey
        })
      }
    }
  }
}
