import * as actionTypes from '../constants/actionTypes'
import api_client from '../api_client'

export function setCategories (categories) {
  return {
    type: actionTypes.CATEGORIES_SET,
    payload: categories
  }
}

export function setCategoriesRetrieved (retrievalStatus) {
  return {
    type: actionTypes.CATEGORIES_RETRIEVED,
    payload: retrievalStatus
  }
}

export function setCategoryEventsRetrieved (categoryId) {
  return {
    type: actionTypes.CATEGORY_EVENTS_RETRIEVED,
    payload: categoryId
  }
}

export function fetchCategories (successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.fetchAllGet('categories')
      .then(successCallBack, errorCallBack)
  }
}

export function fetchCategoryEvents (successCallBack, errorCallBack, _searchParams) {
  return function (dispatch) {
    const { categoryId, lookup_param, lookup_term } = _searchParams
    const searchParams = {}
    if (lookup_param) { searchParams.lookup_param = lookup_param }
    if (lookup_term) { searchParams.lookup_term = lookup_term }

    return api_client.fetchAllGet(`categories/${categoryId}/events`, { searchParams })
      .then(successCallBack, errorCallBack)
      .then(setCategoryEventsRetrieved(categoryId))
  }
}
