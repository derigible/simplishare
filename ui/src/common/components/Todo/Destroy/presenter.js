import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Delete from '../../Delete'
import * as customPropTypes from '../../../propTypes'

export default class Destroy extends PureComponent {
  static propTypes = {
    entity: customPropTypes.todoProps.isRequired,
    deleteEntity: PropTypes.func.isRequired,
    parentChain: customPropTypes.todoParentChainProps,
  }

  deleteSelf = () => {
    this.props.deleteEntity(this.props.entity.id, {parentChain: this.props.parentChain })
  }

  render () {
    return (
      <Delete callback={this.deleteSelf} />
    )
  }
}
