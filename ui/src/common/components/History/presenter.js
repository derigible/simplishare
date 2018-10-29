import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Table from '@instructure/ui-elements/lib/components/Table'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'

import Event from '../Event'
import styles from './styles.css'
import theme from './theme'
import themeable from '@instructure/ui-themeable/lib/themeable'

const forwardSorter = (sortByKey) => (eventA, eventB) => {
  const eventAAttr = eventA[sortByKey]
  const eventBAttr = eventB[sortByKey]
  if (eventAAttr < eventBAttr) {
    return -1
  }
  if (eventAAttr > eventBAttr) {
    return 1
  }

  // names must be equal
  return 0
}

const reverseSorter = (sortByKey) => (eventA, eventB) => {
  const eventAAttr = eventA[sortByKey]
  const eventBAttr = eventB[sortByKey]
  if (eventAAttr < eventBAttr) {
    return 1
  }
  if (eventAAttr > eventBAttr) {
    return -1
  }
  // names must be equal
  return 0
}

class History extends PureComponent {
  render () {
    const { events, sortByKey, sortByReverse, setSortKey } = this.props
    let eventList = events
    if (sortByKey !== null) {
      const sorter = sortByReverse ? reverseSorter : forwardSorter
      eventList = eventList.sort(sorter(sortByKey))
    }
    const tableData = eventList.map((event) => {
      return <Event key={event.id} event={event} />
    })

    return <div className={styles.history_wrapper}>
      <div className={styles.table_wrapper}>
        <Table
          size="small"
          striped="columns"
          caption={<ScreenReaderContent>A table of Events</ScreenReaderContent>}
        >
          <thead>
            <tr>
              <th onClick={setSortKey('date')}>Date</th>
              <th onClick={setSortKey('description')}>Description</th>
              <th onClick={setSortKey('categories')}>Categories</th>
              <th onClick={setSortKey('is_debit')}>Type</th>
              <th onClick={setSortKey('amount')}>Amount</th>
              <th>Show More</th>
            </tr>
          </thead>
          <tbody>
          {tableData}
          </tbody>
        </Table>
      </div>
    </div>
  }
}

History.propTypes = {
  events: PropTypes.array,
  sortByKey: PropTypes.string,
  sortByReverse: PropTypes.bool,
  setSortKey: PropTypes.func.isRequired
}

History.defaultProps = {
  events: [],
  sortByKey: 'date',
  sortByReverse: false
}

export default themeable(theme, styles)(History)
