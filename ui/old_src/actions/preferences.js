import * as actionTypes from '../constants/actionTypes'
import api_client from '../api_client'

export function updatePreference (_, preferences, successCallBack, errorCallBack) {
  return function (_) {
    return api_client.put(
      `preferences`,
      {
        requestBody: {
          preferences
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}


export function fetchPreference (_, successCallBack, errorCallBack) {
  return function (_) {
    return api_client.get(
      `preferences`
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function setPreferences (preferences) {
  return {
    type: actionTypes.PREFERENCES_SET_PREFERENCES,
    payload: Array.isArray(preferences) ? preferences[0] : preferences
  }
}
