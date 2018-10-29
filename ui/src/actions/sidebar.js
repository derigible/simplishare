import * as actionTypes from '../constants/actionTypes'

export function closeSidebar () {
  return {
    type: actionTypes.CLOSE_SIDEBAR
  }
}

export function openSidebar () {
  return {
    type: actionTypes.OPEN_SIDEBAR
  }
}
