import * as actionTypes from '../constants/actionTypes'
import api_client from '../api_client'

export function setContacts (contacts) {
  return {
    type: actionTypes.CONTACTS_SET_CONTACTS,
    payload: contacts
  }
}

export function setContactsRetrieved (retrieved) {
  return {
    type: actionTypes.CONTACTS_SET_RETRIEVED,
    payload: retrieved
  }
}

export function fetchContacts (successCallBack, errorCallBack) {
  return function (dispatch) {
    api_client.fetchAllGet('contacts')
      .then(successCallBack, errorCallBack)
  }
}

export function createContact (contact, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.post(
      'contacts',
      {
        requestBody: {
          contact
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}
