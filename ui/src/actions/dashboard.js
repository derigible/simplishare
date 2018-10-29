import * as actionTypes from '../constants/actionTypes'

export function setFilterBy (e) {
  return {
    type: actionTypes.DASHBOARD_SET_FILTER_BY,
    payload: { filterBy: e.target.value }
  }
}

export function setLookupTerm (lookup_term) {
  return {
    type: actionTypes.DASHBOARD_SET_LOOKUP_TERM,
    payload: lookup_term
  }
}

export function setLookupParam (lookup_param) {
  return {
    type: actionTypes.DASHBOARD_SET_LOOKUP_PARAM,
    payload: lookup_param
  }
}

export function setEventsRetrieved (retrievalStatus) {
  return {
    type: actionTypes.DASHBOARD_EVENTS_RETRIEVED,
    payload: retrievalStatus
  }
}
