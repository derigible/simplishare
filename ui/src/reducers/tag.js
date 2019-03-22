import * as actionTypes from '../constants/actionTypes'

const localStorageTags = localStorage.getItem('selectedTags')

const initialState = {
  tags: {},
  tagsRetrieved: 'pending',
  selectedTags: localStorageTags ? JSON.parse(localStorageTags) : []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.TAGS_SET_TAGS:
      return setTags(state, action.payload)
    case actionTypes.TAGS_SET_SELECTED_TAGS:
      return setTagsSelected(state, action.payload)
    case actionTypes.TAGS_SET_RETRIEVED:
      return { ...state, tagsRetrieved: action.payload }
  }
  return state
}

function setTags (state, ts) {
  const tags = {}
  ts.forEach((tag) => {
    tags[tag.id] = tag
  })
  return { ...state, tags: { ...{ ...state.tags, ...tags } } }
}

function setTagsSelected (state, selectedTags) {
  return { ...state, selectedTags}
}
