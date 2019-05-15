import {NAVIGATE_TO} from '../../../constants/actionTypes'

export default (router) => (store) => (next) => (action) => {
  if (action.type === NAVIGATE_TO) {
    router.navigate(action.payload)
  }
  return next(action)
}
