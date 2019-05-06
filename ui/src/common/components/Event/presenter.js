import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Button from '@instructure/ui-buttons/lib/Button'
import themeable from '@instructure/ui-themeable/lib/themeable'

import styles from './styles.css'
import theme from './theme'

const monthNames = [
  'Jan', 'Feb', 'March',
  'April', 'May', 'June', 'July',
  'Aug', 'Sept', 'Oct',
  'Nov', 'Dec'
]

// Might use this in the future once time is taken into account
const prettifyDate = function (date) { // eslint-disable-line no-unused-vars
  const d = new Date(Date.parse(date))
  const dom = ('0' + d.getDate()).slice(-2)
  const year = d.getFullYear()
  const month = monthNames[d.getMonth()]
  const hours = ('0' + d.getHours()).slice(-2)
  const minutes = ('0' + d.getMinutes()).slice(-2)
  const dateString = dom + '-' + month + '-' + year + ' ' + hours + ':' + minutes
  return dateString
}

const getDateOnly = function (date) {
  return date.split('T')[0]
}

class Event extends PureComponent {
  onClick = () => this.props.showMore(event)

  render () {
    const { event } = this.props
    return (
      <tr title={event.notes}>
        <td>{getDateOnly(event.date)}</td>
        <td title={event.description}>
          {event.description}
        </td>
        <td>
          {event.categories.map((category) => { return category.title }).join('|')}
        </td>
        <td>{event.is_debit ? 'Paid' : 'Income'}</td>
        <td className={styles.amount}>{event.amount.toFixed(2)}</td>
        <td>
          <Button size="small" variant="primary" onClick={this.onClick}>More...</Button>
        </td>
      </tr>
    )
  }
}

Event.propTypes = {
  event: PropTypes.object,
  showMore: PropTypes.func
}

Event.defaultProps = {
  event: { categories: [] },
  showMore: () => {}
}

export default themeable(theme, styles)
