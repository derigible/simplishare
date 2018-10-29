import { connect } from 'react-redux'

import {
  update
} from '../../../../api.js'

import Body from './presenter'

function mapStateToProps (state) {
  return {
    possibleTags: [{label: 'Tags', options: Object.values(state.tag.tags)}]
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    updatePreference: (updates) => {
      return update('Todo', {fetchFunc: 'updateTodoPreferences'})(dispatch)(props.entity.id, updates)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body)
