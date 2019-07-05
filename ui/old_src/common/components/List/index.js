import { connect } from 'react-redux'

import {
  create,
  tagEntity,
  removeTag
} from '../../../api.js'

import List from './presenter'

function mapStateToProps (state) {
  return {
    possibleTags: [{label: 'Tags', options: Object.values(state.tag.tags)}],
    selectedTags: state.tag.selectedTags
  }
}


function mapDispatchToProps (dispatch) {
  return {
    createTag: create('Tag')(dispatch),
    tagEntity: tagEntity(dispatch),
    removeTag: removeTag(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(List)
