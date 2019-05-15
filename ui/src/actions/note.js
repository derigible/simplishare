import * as actionTypes from '../constants/actionTypes'
import api_client from '../api_client'

export function setNotes (notes) {
  return {
    type: actionTypes.NOTES_SET_NOTES,
    payload: notes
  }
}

export function removeNote (id) {
  return {
    type: actionTypes.NOTES_REMOVE_NOTE,
    payload: {
      id
    }
  }
}

export function setNotesRetrieved (retrieved) {
  return {
    type: actionTypes.NOTES_SET_RETRIEVED,
    payload: retrieved
  }
}

export function setNoteSharedWith (note) {
  return {
    type: actionTypes.NOTES_SET_NOTE_SHARED_WITH,
    payload: note
  }
}

export function setNoteShareableWith (note) {
  return {
    type: actionTypes.NOTES_SET_NOTE_SHAREABLE_WITH,
    payload: note
  }
}

export function fetchNotes (successCallBack, errorCallBack) {
  return function (dispatch) {
    api_client.fetchAllGet('notes')
      .then(successCallBack, errorCallBack)
  }
}

export function fetchNoteShareableWith (fetchParams, successCallBack, errorCallBack) {
  return function (dispatch) {
    api_client.get(`notes/${fetchParams.id}/shareable_with`)
      .then(successCallBack, errorCallBack)
  }
}

export function fetchNoteSharedWith (fetchParams, successCallBack, errorCallBack) {
  return function (dispatch) {
    api_client.get(`notes/${fetchParams.id}/shared_with`)
      .then(successCallBack, errorCallBack)
  }
}

export function createNote (note, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.post(
      'notes',
      {
        requestBody: {
          note
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function updateNote (id, updates, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.put(
      `notes/${id}`,
      {
        requestBody: {
          note: updates
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function archiveNote (id, archiveOpts, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.put(
      `notes/${id}/archive`,
      {
        requestBody: {
          note: archiveOpts
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function deleteNote (id, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.delete(
      `notes/${id}`
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function shareNote (id, users, successCallBack, errorCallBack) {
  return function () {
    return api_client.post(
      `notes/${id}/share`,
      {
        requestBody: {
          share: {
            users
          }
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function updateNotePreferences (id, preferences, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.put(
      `notes/${id}`,
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

export function snoozeNote (id, snooze_until, successCallBack, errorCallBack, opts = {}) {
  return function (dispatch) {
    return api_client.put(
      `notes/${id}/snooze`,
      {
        requestBody: {
          snooze: {
            snooze_until
          }
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function fetchNote (id, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.get(
      `notes/${id}`
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}
