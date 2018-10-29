import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Responsive from '@instructure/ui-layout/lib/components/Responsive'

import FullScreen from './FullScreen'
import SmallScreen from './SmallScreen'

class WithSidebar extends PureComponent {
  render() {
    const { content, children } = this.props
    return <Responsive
      match="media"
      query={{
        small: { maxWidth: 580 },
        medium: { minWidth: 580 },
        large: { minWidth: 615}
      }}
    >
      {(props, matches) => {
        if (matches.includes('large')) {
          return (
            <FullScreen content={content}>
              {children}
            </FullScreen>
          )
        } else if (matches.includes('medium') && !matches.includes('large')) {
          return (
            <FullScreen
              content={content}
              sidebarWidth="14.5rem"
              contentOffset="15rem"
            >
              {children}
            </FullScreen>
          )
        } else {
          return (
            <SmallScreen content={content}>
              {children}
            </SmallScreen>
          )
        }
      }}
    </Responsive>
  }
}

export default WithSidebar

WithSidebar.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  content: PropTypes.element.isRequired
}
