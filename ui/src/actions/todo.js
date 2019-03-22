import * as actionTypes from '../constants/actionTypes'
import api_client from '../api_client'

export function removeTodo (id, opts = {}) {
  const { parentChain } = opts
  return {
    type: actionTypes.TODOS_REMOVE_TODO,
    payload: {
      parentChain,
      id
    }
  }
}

export function setTodos (todos) {
  return {
    type: actionTypes.TODOS_SET_TODOS,
    payload: todos
  }
}

export function setTodoSharedWith (todos) {
  return {
    type: actionTypes.TODOS_SET_TODO_SHARED_WITH,
    payload: todos
  }
}

export function setTodoShareableWith (todos) {
  return {
    type: actionTypes.TODOS_SET_TODO_SHAREABLE_WITH,
    payload: todos
  }
}

export function setTodosRetrieved (retrieved) {
  return {
    type: actionTypes.TODOS_SET_RETRIEVED,
    payload: retrieved
  }
}

export function fetchTodos (successCallBack, errorCallBack) {
  return function (dispatch) {
    api_client.fetchAllGet('todos?per_page=150')
      .then(successCallBack, errorCallBack)
  }
}

export function fetchTodoSharedWith (fetchParams, successCallBack, errorCallBack) {
  return function (dispatch) {
    api_client.get(`todos/${fetchParams.id}/shared_with`)
      .then(successCallBack, errorCallBack)
  }
}

export function fetchTodoShareableWith (fetchParams, successCallBack, errorCallBack) {
  return function (dispatch) {
    api_client.get(`todos/${fetchParams.id}/shareable_with`)
      .then(successCallBack, errorCallBack)
  }
}

export function createTodo (todo, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.post(
      'todos',
      {
        requestBody: {
          todo
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function updateTodo (id, updates, successCallBack, errorCallBack, opts = {}) {
  return function (dispatch) {
    return api_client.put(
      `todos/${id}`,
      {
        requestBody: {
          todo: updates,
          parent_chain: opts.parentChain
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function archiveTodo (id, archiveOpts, successCallBack, errorCallBack, opts = {}) {
  return function (dispatch) {
    return api_client.put(
      `todos/${id}/archive`,
      {
        requestBody: {
          todo: archiveOpts,
          parent_chain: opts.parentChain
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function deleteTodo (id, successCallBack, errorCallBack, opts = {}) {
  return function (dispatch) {
    return api_client.delete(
      `todos/${id}`,
      {
        requestBody: {
          parent_chain: opts.parentChain
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function shareTodo (id, users, successCallBack, errorCallBack) {
  return function () {
    return api_client.post(
      `todos/${id}/share`,
      {
        requestBody: {
          share: {
            users
          }
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function updateTodoPreferences (id, preferences, successCallBack, errorCallBack) {
  return function (dispatch) {
    return api_client.put(
      `todos/${id}/preferences`,
      {
        requestBody: {
          preferences
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}

export function snoozeTodo (id, snooze_until, successCallBack, errorCallBack, opts = {}) {
  return function (dispatch) {
    return api_client.put(
      `todos/${id}/snooze`,
      {
        requestBody: {
          snooze: {
            snooze_until
          }
        }
      }
    )
    .then(successCallBack)
    .catch(errorCallBack)
  }
}
