import { connect } from 'react-redux'


import { setSelectedTags } from '../../../actions/tag.js'
import {
  create,
  removeTag,
  fetchList
} from '../../../api.js'

import List from './presenter'

function mapStateToProps (state) {
  const options = Object.values(state.tag.tags)
  return {
    tagsRetrieved: state.tag.tagsRetrieved && options.length > 0 ? 'success' : 'inProgress',
    possibleTags: [{label: 'Tags', options }],
    selectedTags: state.tag.selectedTags
  }
}


function mapDispatchToProps (dispatch) {
  return {
    populateTags: fetchList('Tags')(dispatch),
    createTag: create('Tag')(dispatch),
    removeTag: removeTag(dispatch),
    setSelectedTags: (tags) => dispatch(setSelectedTags(tags))
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(List)
