import * as actions from './actions'
import flashError, { flashCustomErrorMessage } from './common/alerts/errors'

function baseErrorHandler (dispatch, opts) {
  return function (e) {
    if (e.status !== 401) {
      if (e instanceof Error) {
        flashCustomErrorMessage('It appears that a connection cannot be made. Try again later.')
      } else {
        flashError(e)
      }
    } else {
      flashCustomErrorMessage(opts.errorMessage || 'You are not authenticated. Please login.')
      dispatch(actions.navigateTo('/auth'))
      throw e
    }
  }
}

/* eslint-disable import/namespace */
export function fetchOne (entity, funcOpts = {}) {
  return function (dispatch) {
    return function (fetchParams) {
      const setFunc = funcOpts.setFunc || `set${entity}s`
      const fetchFunc = funcOpts.fetchFunc || `fetch${entity}`
      const success = (data) => {
        return dispatch(actions[setFunc]([data]))
      }
      return dispatch(actions[fetchFunc](fetchParams, success, baseErrorHandler(dispatch, funcOpts)))
    }
  }
}

export function fetchShareableWith (entity, funcOpts = {}) {
  return function (dispatch) {
    return function (fetchParams) {
      const setFunc = funcOpts.setFunc || `set${entity}ShareableWith`
      const fetchFunc = funcOpts.fetchFunc || `fetch${entity}ShareableWith`
      const success = (data) => {
        return dispatch(actions[setFunc]({id: fetchParams[funcOpts.shareId] || fetchParams.id, data}))
      }
      return dispatch(actions[fetchFunc](fetchParams, success, baseErrorHandler(dispatch)))
    }
  }
}

export function fetchSharedWith (entity, funcOpts = {}) {
  return function (dispatch) {
    return function (fetchParams) {
      const setFunc = funcOpts.setFunc || `set${entity}SharedWith`
      const fetchFunc = funcOpts.fetchFunc || `fetch${entity}SharedWith`
      const success = (data) => {
        return dispatch(actions[setFunc]({id: fetchParams[funcOpts.shareId] || fetchParams.id, data}))
      }
      return dispatch(actions[fetchFunc](fetchParams, success, baseErrorHandler(dispatch)))
    }
  }
}

export function fetchList (entity, funcOpts = {}) {
  return function (dispatch) {
    return function (opts = {}) {
      const setFunc = funcOpts.setFunc || `set${entity}Retrieved`
      const fetchFunc = funcOpts.fetchFunc || `fetch${entity}`
      const success = (data) => {
        dispatch(actions[setFunc]('success'))
        return dispatch(actions[`set${entity}`](data))
      }
      const error = (e) => {
        dispatch(actions[setFunc]('error'))
        baseErrorHandler(dispatch)(e)
      }

      dispatch(actions[setFunc]('inProgress'))

      return dispatch(actions[fetchFunc](success, error, opts))
    }
  }
}

export function create (entity, funcOpts = {}) {
  return function (dispatch) {
    return function (toCreate, opts = {}) {
      const setFunc = funcOpts.setFunc || `set${entity}s`
      const fetchFunc = funcOpts.fetchFunc || `create${entity}`
      const success = (data) => {
        return dispatch(actions[setFunc]([data]))
      }

      return dispatch(
        actions[fetchFunc](toCreate, success, baseErrorHandler(dispatch), opts)
      )
    }
  }
}

export function update (entity, funcOpts = {}) {
  return function (dispatch) {
    return function (fetchParams, updates, opts = {}) {
      const setFunc = funcOpts.setFunc || `set${entity}s`
      const fetchFunc = funcOpts.fetchFunc || `update${entity}`
      const success = (data) => {
        return typeof setFunc === 'function' ? setFunc() : dispatch(actions[setFunc]([data]))
      }

      return dispatch(
        actions[fetchFunc](fetchParams, updates, success, baseErrorHandler(dispatch), opts)
      )
    }
  }
}

export function destroy (entity, funcOpts = {}) {
  return function (dispatch) {
    return function (fetchParams, opts = {}) {
      const setFunc = funcOpts.setFunc || `remove${entity}`
      const fetchFunc = funcOpts.fetchFunc || `delete${entity}`
      const success = (data) => {
        return dispatch(actions[setFunc](fetchParams, opts))
      }

      return dispatch(
        actions[fetchFunc](fetchParams, success, baseErrorHandler(dispatch), opts)
      )
    }
  }
}
/* eslint-enable import/namespace */

export function tagEntity (dispatch) {
  return function (actionData, tag_ids) {
    const successCallback = (updatedEntity) => {
      return dispatch(Object.assign({}, actionData, { payload: [updatedEntity] }))
    }

    const entity = actionData.type.split('_')[0].toLowerCase()
    return dispatch(
      actions.tagEntity(
        entity,
        actionData.payload[0].id,
        tag_ids,
        successCallback,
        baseErrorHandler(dispatch)
      )
    )
  }
}

export function removeTag (dispatch) {
  return function (actionData, tag_ids) {
    const successCallback = (updatedEntity) => {
      return dispatch(Object.assign({}, actionData, { payload: [updatedEntity] }))
    }

    const entity = actionData.type.split('_')[0].toLowerCase()
    return dispatch(
      actions.removeTag(
        entity,
        actionData.payload[0].id,
        tag_ids,
        successCallback,
        baseErrorHandler(dispatch)
      )
    )
  }
}
