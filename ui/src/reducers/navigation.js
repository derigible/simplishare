import * as actionTypes from '../constants/actionTypes'

const initialState = {
  path: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_PATH:
      return updatePath(state, action.payload)
  }
  return state
}

function updatePath (state, path) {
  return { ...state, path }
}
