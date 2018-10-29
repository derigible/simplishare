import { combineReducers } from 'redux'
import auth from './auth'
import event from './event'
import fileUpload from './fileUpload'
import history from './history'
import dashboard from './dashboard'
import sidebar from './sidebar'
import navigation from './navigation'
import category from './category'
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
  event,
  fileUpload,
  history,
  dashboard,
  sidebar,
  navigation,
  category,
  todo,
  tag,
  note,
  contact,
  preference
})
