import api_client from '../api_client'
import * as actionTypes from '../constants/actionTypes'

class ActionHandler {
  success = actionType => data => {
    this.dispatch(
      {
        action: actionTypes.ENTITY_ENTITY_API_ACTION_SUCCESS,
        actionType,
        entityType: this.entityType,
        payload: data
      }
    )
    this.setActionState(actionTypes.FETCH_STATE_SUCCESS, actionType)
    return data
  }

  error = actionType => e => {
    if (e.status !== 401) {
      this.dispatch(
        {action: actionTypes.ALERT_ERROR_ALERT, entityType: this.entityType, payload: e}
      )
    } else {
      this.dispatch({action: actionTypes.ALERT_LOGIN_ALERT, payload: e})
    }
    this.setActionState(actionTypes.FETCH_STATE_ERROR, actionType)
    return e
  }

  setActionState = (state, actionType) => {
    return this.dispatch(
      {
        action: actionTypes.ENTITY_SET_ENTITY_API_ACTION_STATE,
        entityType: this.entityType,
        actionType,
        payload: state
      }
    )
  }

  startAction = actionType => this.setActionState(
    actionTypes.FETCH_STATE_IN_PROGRESS,
    actionType
  )
}

export default class BaseActions extends ActionHandler {
  constructor(entityType, dispatch, client = api_client) {
    super()
    this.entityType = entityType
    this.dispatch = dispatch
    this.client = client
  }

  create = (params) => {
    const action = actionTypes.ENTITY_ACTION_CREATE
    this.startAction(action)
    return this.client.post(this.entityType, { requestBody: params })
      .then(this.success(action), this.error(action))
  }

  read = (id) => {
    const action = actionTypes.ENTITY_ACTION_READ
    this.startAction(action)
    return this.client.get(`${this.entityType}/${id}`)
      .then(this.success(action), this.error(action))
  }

  update = (id, params) => {
    const action = actionTypes.ENTITY_ACTION_UPDATE
    this.startAction(action)
    return this.client.put(`${this.entityType}/${id}`, { requestBody: params })
      .then(this.success(action), this.error(action))
  }

  destroy = (id) => {
    const action = actionTypes.ENTITY_ACTION_DESTROY
    this.startAction(action)
    return this.client.destroy(`${this.entityType}/${id}`)
      .then(this.success(action), this.error(action))
  }

  list = () => {
    const action = actionTypes.ENTITY_ACTION_LIST
    this.startAction(action)
    return this.client.get(this.entityType)
      .then(this.success(action), this.error(action))
  }

  archive = (id) => {
    const action = actionTypes.ENTITY_ACTION_ARCHIVE
    this.startAction(action)
    return this.client.put(`${this.entityType}/${id}/archive`)
      .then(this.success(action), this.error(action))
  }

  unarchive = (id) => {
    const action = actionTypes.ENTITY_ACTION_UNARCHIVE
    this.startAction(action)
    return this.client.destroy(`${this.entityType}/${id}/archive`)
      .then(this.success(action), this.error(action))
  }

  snooze = (id, params) => {
    const action = actionTypes.ENTITY_ACTION_SNOOZE
    this.startAction(action)
    return this.client.put(`${this.entityType}/${id}/snooze`, { requestBody: params })
      .then(this.success(action), this.error(action))
  }

  unsnooze = (id) => {
    const action = actionTypes.ENTITY_ACTION_UNSNOOZE
    this.startAction(action)
    return this.client.destroy(`${this.entityType}/${id}/snooze`)
      .then(this.success(action), this.error(action))
  }

  tag = (id, tag_ids) => {
    const action = actionTypes.ENTITY_ACTION_TAG
    this.startAction(action)
    return this.client.post(`${this.entityType}/${id}/tag`, { requestBody: {tag_ids}})
      .then(this.success(action), this.error(action))
  }

  untag = (id, tag_ids) => {
    const action = actionTypes.ENTITY_ACTION_UNTAG
    this.startAction(action)
    return this.client.destroy(`${this.entityType}/${id}/tag`, { requestBody: {tag_ids}})
      .then(this.success(action), this.error(action))
  }

  share = (id, users) => {
    const action = actionTypes.ENTITY_ACTION_SHARE
    this.startAction(action)
    return this.client.post(`${this.entityType}/${id}/share`, { requestBody: {share: {users}}})
      .then(this.success(action), this.error(action))
  }

  unshare = (id, users) => {
    const action = actionTypes.ENTITY_ACTION_UNSHARE
    this.startAction(action)
    return this.client.destroy(`${this.entityType}/${id}/share`, { requestBody: {share: {users}}})
      .then(this.success(action), this.error(action))
  }

  sharedDetails = (id) => {
    const action = actionTypes.ENTITY_ACTION_SHARE
    this.startAction(action)
    return this.client.get(`${this.entityType}/${id}/share`)
      .then(this.success(action), this.error(action))
  }

  preferences = (id, params) => {
    // implement
  }
}
