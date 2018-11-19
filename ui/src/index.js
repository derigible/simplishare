import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import theme from '@instructure/ui-themes/lib/canvas'

theme.use()

import configureStore from './stores/configureStore'
import { updatePath } from './actions'
import { registerAuthorizationCheck, registerAuthorizationHeader, registerDefaultErrorHandler } from './api_client'
import { getAuthorizationHeader, getAccessToken } from './api_client/basicInterface'
import getAppData, { registerState } from './api_client/hydrator'

import { router } from './router'
import flashError from './common/alerts/errors'

const store = configureStore({}, router)
registerAuthorizationHeader(getAuthorizationHeader)

const refreshTokenConnection = () => {}
registerAuthorizationCheck(refreshTokenConnection)
registerDefaultErrorHandler((response) => {
  const path = window.location.hash
  const strippedPath = path.replace(/\//g, '')

  if (response.status === 401 && strippedPath.split('?')[0] !== '#!auth') {
    router.navigate(`auth?redirect=${path}`)
  }
})

const authToken = getAccessToken()
let path = window.location.hash
const pathParts = path.split('/')

if (!authToken && !pathParts.includes('#!auth')) {
  path = `#!auth?redirect=${path}`
  window.history.replaceState({}, 'auth page', path)
}

registerState(store.getState())
getAppData(store.dispatch, path)

router.on('route', async (_, routing) => {
  try {
    const view = await routing
    store.dispatch(updatePath(path))

    ReactDOM.render(
      <Provider store={store}>
        {view}
      </Provider>,
      document.getElementById('app')
    )
  } catch (ex) {
    flashError(ex)
  }
}).start()
