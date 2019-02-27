import fetch from 'isomorphic-fetch'

export const handleBrowserError = (response) => {
  throw response
}

let authorizationCheck
let authorizationHeader = () => { return {} }
let defaultSuccessHandler = handleSuccessMessage
let defaultErrorHandler = handleErrorMessage

export function registerAuthorizationCheck (func) {
  authorizationCheck = func
}

export function registerAuthorizationHeader (func) {
  authorizationHeader = func
}

export function registerDefaultSucessHandler (handler) {
  defaultSuccessHandler = handler
}

export function registerDefaultErrorHandler (handler) {
  defaultErrorHandler = handler
}

let apiHost = null

// both www.pinkairship.com and pinkairship.com point to same api, so prevent browser CORS check
if (process.env.API_HOST === 'pinkairship.com' && window.location.hostname.includes('www')) {
  apiHost = `www.${process.env.apiHost}`
} else {
  apiHost = process.env.API_HOST
}

const apiUrl = `${process.env.API_PROTOCOL}://${apiHost}/`

const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

function handleStatus (successHandler, errorHandler) {
  return function (response) {
    if (response.status >= 200 && response.status < 300) {
      successHandler(response, 'Successful retrieval.')
      return Promise.resolve(response)
    } else {
      errorHandler(response)
      return Promise.reject(response)
    }
  }
}

function generateCallHeaders (callHeaders) {
  return Object.assign({}, authorizationHeader(), callHeaders)
}

function displayError (errorMessage) {
  console.log(errorMessage) // eslint-disable-line no-console
}

function handleSuccessMessage (response, successMessage) {
  console.log(response.status, successMessage) // eslint-disable-line no-console
  return response
}

function handleErrorMessage (response, onError) {
  if (onError) {
    // Custom error handler
    onError(response)
  } else if (response.headers.get('Content-Type').includes('json')) {
    response.json().then(function (responseBody) {
      displayError(response.status + 'Error - ' + JSON.stringify(responseBody))
    })
  } else {
    displayError('Sorry, there was a ' + response.status + ' Error.')
  }
  return response
}

function stripLeadingSlash (url) {
  return url.replace(/^\/+|\/+$/g, '')
}

function buildQuery (searchParams) {
  if (Object.keys(searchParams).length === 0) {
    return ''
  }
  const queryBuilder = new URLSearchParams()
  Object.keys(searchParams).forEach((queryKey) => {
    queryBuilder.append(queryKey, searchParams[queryKey])
  })
  return '?' + queryBuilder.toString()
}

export function createFetchMethod (method) {
  return async function (
    url,
    {
      callHeaders = jsonHeaders,
      doFetch = fetch,
      beforeFetch = () => {},
      // Huh? not sure why there is this thing here. Refactor
      handleSuccessRequest = handleStatus(defaultSuccessHandler, defaultErrorHandler),
      handleFailureRequest = handleBrowserError,
      searchParams = {},
      requestBody,
      isJsonRequest = true,
      skipTransform = false
    } = {}) {
    await beforeFetch()
    let request = {
      method,
      headers: generateCallHeaders(callHeaders)
    }
    if (requestBody) {
      const body = isJsonRequest ? JSON.stringify(requestBody) : requestBody
      request = Object.assign({}, request, { body })
    }
    return doFetch(`${apiUrl}${stripLeadingSlash(url)}${buildQuery(searchParams)}`, request)
      .then(handleSuccessRequest)
      .then(
        function (response) {
          // support handling json content by default, otherwise handle response separately
          if (
            response.headers.get('Content-Type')
            && response.headers.get('Content-Type').includes('json')
            && !skipTransform) {
            return response.json()
          }
          return response
        }
      )
      .catch(handleFailureRequest)
  }
}

export function withAuthorizationCheck (fetchFunction) {
  return async function () {
    await authorizationCheck()
    return fetchFunction(...arguments)
  }
}

const get = withAuthorizationCheck(createFetchMethod('GET'))
const post = withAuthorizationCheck(createFetchMethod('POST'))
const patch = withAuthorizationCheck(createFetchMethod('PATCH'))
const put = withAuthorizationCheck(createFetchMethod('PUT'))
const deleter = withAuthorizationCheck(createFetchMethod('DELETE'))

function combineResponses (responses) {
  return responses.reduce((response, accumulator) => [...accumulator, ...response], [])
}

async function fetchAllGet (url, getOptions = {}) {
  const response = await get(url, { ...getOptions, skipTransform: true })
  if (response instanceof Error) { return response }
  const total = parseInt(response.headers.get('total'), 10)
  const perPage = parseInt(response.headers.get('per-page'), 10)
  if (total > perPage) {
    const totalPages = Math.ceil(total / perPage) - 1
    const promises = [response.json()]
    for (let i = 2; i <= totalPages + 1; i++) {
      const searchParams = Object.assign({}, getOptions.searchParams, { page: i })
      const options = Object.assign({}, getOptions, { searchParams })
      promises.push(get(url, options))
    }
    return await Promise.all(promises).then((responses) => {
      return combineResponses(responses)
    })
  } else {
    return response.json()
  }
}

const client = {
  fetchAllGet,
  get,
  post,
  patch,
  put,
  delete: deleter
}

export default client
