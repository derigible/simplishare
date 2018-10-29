import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Text from '@instructure/ui-elements/lib/components/Text'
import themeable from '@instructure/ui-themeable/lib/themeable'

import styles from './styles.css'
import theme from './theme'

class Selection extends PureComponent {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    period: PropTypes.string.isRequired
  }

  handleSelect = () => {
    if (this.props.selected) { return }
    this.props.onSelect(this.props.period)
  }

  render () {
    const classes = classnames({
      [styles.base]: true,
      [styles.clicked]: this.props.selected
    })
    return (
      <button className={classes} onClick={this.handleSelect}>
        <Text transform="capitalize">{this.props.period}</Text>
      </button>
    )
  }
}

export default themeable(theme, styles)(Selection)
