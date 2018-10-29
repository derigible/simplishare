import { createFetchMethod } from './'

const TOKEN_REFRESH_WINDOW_IN_MS = 1000 * 60 * 2 // Two minutes

export function getAccessToken () {
  return window.localStorage.getItem('accessToken')
}

export function getRefreshToken () {
  return window.localStorage.getItem('refreshToken')
}

export function getAuthorizationHeader () {
  return {Authorization: `Bearer ${getAccessToken()}`}
}

export function tokenNeedsRefresh (currentTime = Date.now()) {
  const createdAt = window.localStorage.getItem('createdAt')
  const expiresIn = window.localStorage.getItem('expiresIn')

  const createdAtMilliseconds = (createdAt * 1000)
  const expiresInMilliseconds = (expiresIn * 1000)
  const expiresAt = createdAtMilliseconds + expiresInMilliseconds

  return currentTime + TOKEN_REFRESH_WINDOW_IN_MS > expiresAt
}

export function refreshToken (tokenCallback) {
  return function (url, params) {
    const refreshToken = getRefreshToken()
    if (!tokenNeedsRefresh() || !refreshToken) { return }
    return createFetchMethod('POST')(
      'account/token',
      {
        requestBody: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }
      }
    ).then((json) => {
      tokenCallback(json)
    })
  }
}
