import * as actionTypes from '../constants/actionTypes'

const initialState = {
  sortByKey: null,
  sortByReverse: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.HISTORY_SET_SORT_BY_KEY:
      return setSortByKey(state, action.payload)
  }
  return state
}

function setSortByKey (state, sortByKey) {
  let { sortByReverse } = state
  if (sortByKey === state.sortByKey) {
    sortByReverse = !sortByReverse
  }
  return { ...state, sortByKey, sortByReverse }
}
