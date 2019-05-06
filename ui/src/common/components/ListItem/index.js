import PropTypes from 'prop-types'
import React, { Component } from 'react'

import View from '@instructure/ui-layout/lib/View'

export default class ListItem extends Component {
  static propTypes = {
    renderChildren: PropTypes.func.isRequired,
    hideBorder: PropTypes.bool
  }

  static defaultProps = {
    hideBorder: true
  }

  state = {
    hovered: false,
    forceFocus: false
  }

  get listItemInFocus () {
    return this.state.hovered || this.state.forceFocus
  }

  focusOn = () => {
    this.setState({ hovered: true })
  }

  focusOff = () => {
    this.setState({ hovered: false })
  }

  forceFocus = () => {
    this.setState({ forceFocus: !this.state.forceFocus })
  }

  render () {
    const { renderChildren, hideBorder } = this.props
    return (
      <View
        as="div"
        background="default"
        borderWidth={hideBorder ? undefined : `${this.listItemInFocus ? 'medium' : 'small'} none none none`}
        padding="xxx-small"
        onMouseEnter={this.focusOn}
        onMouseLeave={this.focusOff}
        onBlur={this.focusOff}
        onFocus={this.focusOn}
      >
        <div style={this.listItemInFocus ? {backgroundColor: 'aliceblue'} : {}}>
          {renderChildren(this.forceFocus)}
        </div>
      </View>
    )
  }
}
