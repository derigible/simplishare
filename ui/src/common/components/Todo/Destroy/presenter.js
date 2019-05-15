import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Delete from '../../Delete'
import * as customPropTypes from '../../../propTypes'

export default class Destroy extends PureComponent {
  static propTypes = {
    entity: customPropTypes.todoProps.isRequired,
    deleteEntity: PropTypes.func.isRequired
  }

  deleteSelf = () => {
    this.props.deleteEntity(this.props.entity.id)
  }

  render () {
    return (
      <Delete callback={this.deleteSelf} />
    )
  }
}
