import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Heading from '@instructure/ui-elements/lib/components/Heading'
import View from '@instructure/ui-layout/lib/components/View'

import Chrome from '../../../common/components/Chrome'

export default class Page extends PureComponent {
  static propTypes = {
    children: PropTypes.element,
    pageName: PropTypes.string
  }

  render () {
    const { children, pageName } = this.props
    return (
      <Chrome>
        <View as="div" margin="xx-large none none none">
          { pageName
            ? <Heading margin="small" border="bottom">{pageName}</Heading>
            : null
          }
          <View
            margin="none none large none"
            as="div"
          >
            {children}
          </View>
        </View>
      </Chrome>
    )
  }
}
