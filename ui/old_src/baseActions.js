import api_client from './api_client'
import * as msgs from './constants/actionTypes'

class ActionHandler {
  success = actionType => data => {
    this.dispatch(
      {
        action: msgs.ENTITY_ENTITY_API_ACTION_SUCCESS,
        actionType,
        entityType: this.entityType,
        payload: data
      }
    )
    this.setActionState(msgs.FETCH_STATE_SUCCESS, actionType)
    return data
  }

  error = actionType => e => {
    if (e.status !== 401) {
      this.dispatch(
        {action: msgs.ALERT_ERROR_ALERT, entityType: this.entityType, payload: e}
      )
    } else {
      this.dispatch({action: msgs.ALERT_LOGIN_ALERT, payload: e})
    }
    this.setActionState(msgs.FETCH_STATE_ERROR, actionType)
    return e
  }

  setActionState = (state, actionType) => {
    return this.dispatch(
      {
        action: msgs.ENTITY_SET_ENTITY_API_ACTION_STATE,
        entityType: this.entityType,
        actionType,
        payload: state
      }
    )
  }

  startAction = actionType => this.setActionState(
    msgs.FETCH_STATE_IN_PROGRESS,
    actionType
  )

  url (opts) {
    let url = this.entityType
    if (opts.head) { url += `/${opts.head}` }
    if (opts.id) { url += `/${opts.id}` }
    if (opts.tail) { url += `/${opts.tail}` }
    return url
  }

  requestBody (params) {
    return params ? { requestBody: params } : {}
  }

  post = (action, {params, path = {}}) => {
    this.startAction(action)
    return this.client.post(this.url(path), this.requestBody(params))
      .then(this.success(action), this.error(action))
  }

  get = (action, {id = null, path = {}}) => {
    this.startAction(action)
    return this.client.get(this.url({...path, id}))
      .then(this.success(action), this.error(action))
  }

  put = (action, {id, params, path = {}}) => {
    this.startAction(action)
    return this.client.put(this.url({...path, id}), this.requestBody(params))
      .then(this.success(action), this.error(action))
  }

  delete = (action, {id = null, path = {}}) => {
    this.startAction(action)
    return this.client.destroy(this.url({...path, id}))
      .then(this.success(action), this.error(action))
  }
}

export default class BaseActions extends ActionHandler {
  constructor(entityType, dispatch, client = api_client) {
    super()
    this.entityType = entityType
    this.dispatch = dispatch
    this.client = client
  }

  create = (params) => this.post(msgs.ENTITY_ACTION_CREATE, {params})

  read = (id) => this.get(msgs.ENTITY_ACTION_READ, {id})

  update = (id, params) => this.put(msgs.ENTITY_ACTION_UPDATE, {id, params})

  destroy = (id) => this.delete(msgs.ENTITY_ACTION_DESTROY, {id})

  list = () => this.get(msgs.ENTITY_ACTION_LIST)

  archive = (id) => this.put(
    msgs.ENTITY_ACTION_ARCHIVE, {id, path: { tail: 'archive' }}
  )

  unarchive = (id) => this.delete(
    msgs.ENTITY_ACTION_UNARCHIVE, {id, path: { tail: 'archive' }}
  )

  snooze = (id, params) => this.put(
    msgs.ENTITY_ACTION_SNOOZE, {id, params, path: { tail: 'snooze' }}
  )

  unsnooze = (id) => this.delete(
    msgs.ENTITY_ACTION_UNSNOOZE, {id, path: { tail: 'snooze' }}
  )

  tag = (id, tag_ids) => this.post(
    msgs.ENTITY_ACTION_TAG, {id, params: {tag_ids}, path: { tail: 'tag' }}
  )

  untag = (id, tag_ids) => this.delete(
    msgs.ENTITY_ACTION_UNTAG, {id, params: {tag_ids}, path: { tail: 'tag' }}
  )

  share = (id, users) => this.post(
    msgs.ENTITY_ACTION_SHARE, {id, params: {share: {users}}, path: { tail: 'share' }}
  )

  unshare = (id, users) => this.delete(
    msgs.ENTITY_ACTION_UNSHARE, {id, params: {share: {users}}, path: { tail: 'share' }}
  )

  sharedWith = (id) => this.get(
    msgs.ENTITY_ACTION_SHARED_WITH, {id, path: { tail: 'shared_with' }}
  )

  shareableWith = (id) => this.get(
    msgs.ENTITY_ACTION_SHAREABLE_WITH, {id, path: { tail: 'shareable_with' }}
  )

  preferences = (id, params) => this.put(
    msgs.ENTITY_ACTION_UPDATE_PREFERENCES,
    {id, preferences: params, path: { tail: 'preferences' }}
  )
}
