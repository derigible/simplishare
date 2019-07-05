import { combineReducers } from 'redux'
import auth from './auth'
import sidebar from './sidebar'
import todo from './todo'
import tag from './tag'
import note from './note'
import contact from './contact'
import preference from './preference'

export default (state, action) => {
  if (action.type === 'AUTH_LOGOUT') {
    // eslint-disable-next-line
    state = undefined
    window.localStorage.clear()
  }

  return appReducer(state, action)
}

const appReducer = combineReducers({
  auth,
  sidebar,
  todo,
  tag,
  note,
  contact,
  preference
})
