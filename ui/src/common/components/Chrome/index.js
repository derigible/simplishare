import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import View from '@instructure/ui-layout/lib/components/View'

import Header from '../Header'

export default class Chrome extends PureComponent {
  render() {
    return (
      <View as='div'>
        <Header>
          {this.props.sidebarChildren}
        </Header>
        <View>
          {this.props.children}
        </View>
      </View>
    )
  }
}

Chrome.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  sidebarChildren: PropTypes.element
}
