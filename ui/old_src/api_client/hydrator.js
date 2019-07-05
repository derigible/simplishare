import { setUserInfo, setPreferences } from '../actions'
import { fetchList } from '../api'

let state

export function registerState (newState) {
  state = newState
}

function getState () {
  if (typeof state === 'undefined') {
    throw 'State has not been registered'
  }
  return state
}

function getTags (dispatch) {
  if (getState().tag.tagsRetrieved === 'pending') {
    fetchList('Tags')(dispatch)()
  }
}

function getTodoData (dispatch) {
  if (getState().todo.todosRetrieved === 'pending') {
    fetchList('Todos')(dispatch)()
  }
}

function getNoteData (dispatch) {
  if (getState().note.notesRetrieved === 'pending') {
    fetchList('Notes')(dispatch)()
  }
}

function populateUserData (dispatch) {
  const userData = JSON.parse(window.localStorage.getItem('userData'))
  dispatch(setUserInfo(userData))
  dispatch(setPreferences(userData))
}

export default function getAppData (dispatch, routePath) {
  const appRegex = /(?:#!)?(\w*)[/?\s]?/
  const app = routePath === '' ? 'todos' : appRegex.exec(routePath)[1]
  if (app === 'auth') { return }
  populateUserData(dispatch)
  getTags(dispatch)
  if (app === 'todos' || app === '') {
    getTodoData(dispatch)
  }
  if (app === 'notes') {
    getNoteData(dispatch)
  }
}
