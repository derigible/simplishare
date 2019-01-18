import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'
import Link from '@instructure/ui-elements/lib/components/Link'
import themeable from '@instructure/ui-themeable'

import styles from './styles.css'
import theme from './theme'

class NavigationLink extends Component {
  onClick = () => {
    this.props.navigateTo(this.props.href)
  }

  render () {
    const { href, windowPathname, children } = this.props
    if (windowPathname.includes(href)) {
      const classes = classNames(styles.link, styles.active)
      return <div className={classes}>{children}</div>
    }

    return (
      <Link onClick={this.onClick} margin="none">
        <span className={styles.link}>
          {children}
        </span>
      </Link>
    )
  }
}

// eslint-disable-next-line immutable/no-mutation
NavigationLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  windowPathname: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired
}

export default themeable(theme, styles)(NavigationLink)
