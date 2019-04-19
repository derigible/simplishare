import { connect } from 'react-redux'

import * as actions from '../../../actions'
import {
  fetchShareableWith,
  fetchSharedWith
} from '../../../api.js'

import Share from './presenter'

function mapStateToProps (state, props) {
  const entity = state[props.shareType.toLowerCase()].entities[props.shareId] || {}
  const sharedWith = entity.sharedWith
  const shareableWith = entity.shareableWith

  return { shareableWith, sharedWith }
}

function mapDispatchToProps (dispatch, props) {
  return {
    onShare: (shareId, selectedUsers, success = () => {}, error = () => {}) => {
      // eslint-disable-next-line import/namespace
      actions[`share${props.shareType}`](shareId, selectedUsers, success, error)()
    },
    fetchShareableWith: fetchShareableWith(props.shareType)(dispatch),
    fetchSharedWith: fetchSharedWith(props.shareType)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Share)
