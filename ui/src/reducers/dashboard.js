import * as actionTypes from '../constants/actionTypes'

const initialState = {
  filterBy: '',
  eventsRetrieved: 'pending'
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.DASHBOARD_SET_FILTER_BY:
      return { ...state, filterBy: action.payload.filterBy }
    case actionTypes.DASHBOARD_SET_LOOKUP_TERM:
      return {
        ...state,
        lookup_term: action.payload,
        lookup_param: null,
        eventsRetrieved: 'pending'
      }
    case actionTypes.DASHBOARD_SET_LOOKUP_PARAM:
      return { ...state, lookup_param: action.payload, eventsRetrieved: 'pending' }
    case actionTypes.DASHBOARD_EVENTS_RETRIEVED:
      return setEventsRetrieved(state, action.payload)
  }
  return state
}

function setEventsRetrieved (state, retrievalStatus) {
  return { ...state, ...{ eventsRetrieved: retrievalStatus } }
}
