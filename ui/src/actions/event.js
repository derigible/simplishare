import * as actionTypes from '../constants/actionTypes'
import api_client from '../api_client'

export function setEvents (events) {
  return {
    type: actionTypes.EVENTS_SET,
    payload: events
  }
}

export function eventShowMore (event) {
  return {
    type: actionTypes.EVENTS_SHOW_MORE,
    payload: event
  }
}

export function fetchEventsByPeriod (
  successCallBack,
  errorCallBack,
  _searchParams = {}
) {
  return function (dispatch) {
    let searchParams
    if (typeof _searchParams.lookup_term === 'undefined') {
      searchParams = Object.assign({}, _searchParams, { lookup_term: 'month' })
    } else {
      searchParams = _searchParams
    }
    return api_client.fetchAllGet('events', { searchParams })
      .then(successCallBack, errorCallBack)
  }
}
