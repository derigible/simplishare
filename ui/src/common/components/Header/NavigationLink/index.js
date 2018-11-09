import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'
import Link from '@instructure/ui-elements/lib/components/Link'
import themeable from '@instructure/ui-themeable'

import styles from './styles.css'
import theme from './theme'

class NavigationLink extends Component {
  render () {
    const { href, windowPathname, children } = this.props
    if (windowPathname.includes(href)) {
      const classes = classNames(styles.link, styles.active)
      return <div className={classes}>{children}</div>
    }
    return (
      <Link href={href} margin="none">
        <span className={styles.link}>
          {children}
        </span>
        <div className={styles.inactive} />
      </Link>
    )
  }
}

// eslint-disable-next-line immutable/no-mutation
NavigationLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  windowPathname: PropTypes.string.isRequired
}

export default themeable(theme, styles)(NavigationLink)