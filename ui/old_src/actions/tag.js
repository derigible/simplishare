import * as actionTypes from '../constants/actionTypes'
import api_client from '../api_client'

export function setTags (tags) {
  return {
    type: actionTypes.TAGS_SET_TAGS,
    payload: tags
  }
}

export function setSelectedTags (tags) {
  return {
    type: actionTypes.TAGS_SET_SELECTED_TAGS,
    payload: tags
  }
}

export function setTagsRetrieved (retrieved) {
  return {
    type: actionTypes.TAGS_SET_RETRIEVED,
    payload: retrieved
  }
}

export function fetchTags (successCallback, errorCallback) {
  return function (dispatch) {
    api_client.fetchAllGet('tags')
      .then(successCallback, errorCallback)
  }
}

export function createTag(tag, successCallback, errorCallback) {
  return function (dispatch) {
    return api_client.post(
      'tags',
      {
        requestBody: {
          tag
        }
      }
    )
    .then(successCallback)
    .catch(errorCallback)
  }
}

export function tagEntity(entity, entityId, tag_ids, successCallback, errorCallback) {
  return function (dispatch) {
    return api_client.post(
      `${entity}/${entityId}/tags`,
      {
        requestBody: {
          tag_ids
        }
      }
    )
    .then(successCallback)
    .catch(errorCallback)
  }
}

export function removeTag(entity, entityId, tag_ids, successCallback, errorCallback) {
  return function (dispatch) {
    return api_client.delete(
      `${entity}/${entityId}/tags`,
      {
        requestBody: {
          tag_ids
        }
      }
    )
    .then(successCallback)
    .catch(errorCallback)
  }
}
