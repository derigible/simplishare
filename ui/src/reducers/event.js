import * as actionTypes from '../constants/actionTypes'

const initialState = {
  entities: {},
  shownEvent: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.EVENTS_SET:
      return setEvents(state, action.payload)
    case actionTypes.EVENTS_SHOW_MORE:
      return showMoreOfEvent(state, action.payload)
    case actionTypes.DASHBOARD_SET_LOOKUP_TERM:
    case actionTypes.DASHBOARD_SET_LOOKUP_PARAM:
      return lookuptermReset(state)
  }
  return state
}

function setEvents (state, events) {
  const entities = {}
  events.forEach((event) => {
    entities[event.id] = event
  })
  return { ...state, entities: { ...state.entities, ...entities } }
}

function showMoreOfEvent (state, event) {
  return { ...state, shownEvent: event }
}

function lookuptermReset (state) {
  return { ...state, entities: {} }
}
