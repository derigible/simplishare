import * as actionTypes from '../constants/actionTypes'

const initialState = {
  isOpen: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CLOSE_SIDEBAR:
      return setSidebarOpenState(state, false)
    case actionTypes.OPEN_SIDEBAR:
      return setSidebarOpenState(state, true)
  }
  return state
}

function setSidebarOpenState (state, value) {
  return { ...state, isOpen: value }
}
