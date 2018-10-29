import * as actionTypes from '../constants/actionTypes'

const initialState = {
  categories: [],
  filterBy: '',
  categoriesRetrieved: 'pending'
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CATEGORIES_SET:
      return setCategories(state, action.payload)
    case actionTypes.CATEGORIES_RETRIEVED:
      return setCategoriesRetrieved(state, action.payload)
    case actionTypes.CATEGORY_EVENTS_RETRIEVED:
      return setCategoryEventsRetrieved(state, action.payload)
  }
  return state
}

function setCategories (state, categories) {
  const _categories = {}
  categories.forEach((cat) => {
    _categories[cat.id] = cat
  })
  return { ...state, _categories }
}

function setCategoriesRetrieved (state, action) {
  const { retrievalStatus } = action
  return { ...state, ...{ categoriesRetrieved: retrievalStatus } }
}

function setCategoryEventsRetrieved (state, action) {
  const category = state.categories[action.categoryId]
  return {
    ...state,
    ...{
      categories: {
        ...state.categories,
        [category.id]: { ...category, eventsRetrieved: true }
      }
    }
  }
}
