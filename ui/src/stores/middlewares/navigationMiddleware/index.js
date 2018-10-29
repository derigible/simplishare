import {NAVIGATE_TO, GO_BACK, NAVIGATE_WITHOUT_ROUTING} from '../../../constants/actionTypes'

export default (router) => (store) => (next) => (action) => {
  if (action.type === NAVIGATE_TO) {
    router.navigate(action.payload)
  }

  if (action.type === NAVIGATE_WITHOUT_ROUTING) {
    router.replace(action.payload)
  }

  if (action.type === GO_BACK) {
    router.back()
  }

  return next(action)
}
