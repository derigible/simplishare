import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Checkmark from '../../Checkmark'
import * as customPropTypes from '../../../propTypes'

export default class Todo extends PureComponent {
  static propTypes = {
    entity: customPropTypes.todoProps.isRequired,
    archiveEntity: PropTypes.func.isRequired,
    parentChain: customPropTypes.todoParentChainProps,
  }

  markCompleted = () => {
    const updates = { archived: !this.props.entity.archived }
    if (!this.props.entity.sharedOn && this.props.entity.shared) {
      if (confirm('Do you want to mark complete for all users?')) {
        updates.update_shared = true
      }
    }
    this.props.archiveEntity(this.props.entity.id, updates, {parentChain: this.props.parentChain })
  }

  render () {
    return (
      <Checkmark callback={this.markCompleted} />
    )
  }
}
