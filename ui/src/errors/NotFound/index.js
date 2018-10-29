import React, { PureComponent } from 'react'
import themeable from '@instructure/ui-themeable/lib/themeable'

import styles from './styles.css'
import theme from './theme'

class NotFound extends PureComponent {
  render () {
    return (
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          404
        </div>
        <div className={styles.textWrapper}>
          <div className={styles.title}>
            Page Not Found
          </div>
          <div className={styles.subtitle}>
            We cannot find the page you requested. Sorry...
          </div>
        </div>
      </div>
    )
  }
}

export default themeable(theme, styles)(NotFound)
