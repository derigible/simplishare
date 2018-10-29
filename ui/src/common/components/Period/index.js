import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Text from '@instructure/ui-elements/lib/components/Text'
import themeable from '@instructure/ui-themeable/lib/themeable'

import Selection from './Selection'
import Specify from './Specify'

import styles from './styles.css'
import theme from './theme'

class Period extends PureComponent {
  render () {
    const { onSelect, periods, selected, specified, onSpecification } = this.props
    return (
      <div>
        <Text>Period</Text>
        {
          periods.map((p) => {
            return (
              <Selection key={p} onSelect={onSelect} selected={p === selected} period={p} />
            )
          })
        }
        <div className={styles.specifyWrapper}>
          <Specify period={selected} specified={specified} onSpecification={onSpecification} />
        </div>
      </div>
    )
  }
}

Period.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSpecification: PropTypes.func.isRequired,
  periods: PropTypes.arrayOf(PropTypes.string.isRequired),
  specified: PropTypes.string
}

Period.defaultProps = {
  onSelect: () => {},
  periods: ['month', 'quarter', 'year'],
  selected: 'month',
  specified: null,
  onSpecification: () => {}
}

export default themeable(theme, styles)(Period)
