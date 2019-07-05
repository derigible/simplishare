import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/index'
import navigationMiddleware from './middlewares/navigationMiddleware'

export default function configureStore (initialState, router) {
  const middleware = [
    thunk,
    navigationMiddleware(router),
    // this is so redux-logger is not included in the production webpack bundle
    (process.env.NODE_ENV !== 'production') && require('redux-logger').createLogger() // eslint-disable-line global-require
  ].filter(Boolean)
  const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)
  return createStoreWithMiddleware(rootReducer, initialState)
}
