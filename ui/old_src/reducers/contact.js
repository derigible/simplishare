import * as actionTypes from '../constants/actionTypes'

const initialState = {
  entities: {},
  contactsRetrieved: 'pending'
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CONTACTS_SET_CONTACTS:
      return setContacts(state, action.payload)
    case actionTypes.CONTACTS_SET_RETRIEVED:
      return setContactsRetrieved(state, action.payload)
  }
  return state
}

function setContacts (state, contacts) {
  const entities = {}
  contacts.forEach((contact) => {
    entities[contact.id] = contact
  })
  return { ...state, entities: { ...state.entities, ...entities } }
}

function setContactsRetrieved (state, status) {
  return { ...state, ...{ contactsRetrieved: status } }
}
