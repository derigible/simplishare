import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Typography from '@instructure/ui-elements/lib/components/Text'
import themeable from '@instructure/ui-themeable/lib/themeable'

import styles from './styles.css'
import theme from './theme'

function extractAmounts (events) {
  const summary = { expenditures: 0, income: 0 }
  events.forEach((e) => {
    if (e.is_debit) {
      summary.expenditures += e.amount
    } else {
      summary.income += e.amount
    }
  })
  summary.expenditures *= -1
  return summary
}

class Summary extends PureComponent {
  render () {
    const { income, expenditures } = extractAmounts(this.props.events)
    return (
      <div className={styles.wrapper}>
        <div className={styles.datum}>
          <Typography>Income: </Typography>
          <Typography size="small">${income.toFixed(2)}</Typography>
        </div>
        <div className={styles.datum}>
          <Typography>Expenditures: </Typography>
          <Typography size="small">${expenditures.toFixed(2)}</Typography>
        </div>
        <div className={styles.datum}>
          <Typography>Balance: </Typography>
          <Typography size="small">${(income + expenditures).toFixed(2)}</Typography>
        </div>
      </div>
    )
  }

}

Summary.propTypes = {
  events: PropTypes.array
}

Summary.defaultProps = {
  events: []
}

export default themeable(theme, styles)(Summary)
