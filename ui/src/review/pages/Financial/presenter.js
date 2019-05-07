import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Heading} from '@instructure/ui-elements'
import {TextInput} from '@instructure/ui-forms'
import {themeable} from '@instructure/ui-themeable'

import History from '../../../../common/components/History'
import Summary from '../../../../common/components/Summary'
import Period from '../../../../common/components/Period'
import SpinnerOverlay from '../../../../common/components/SpinnerOverlay'

import styles from './styles.css'
import theme from './theme'

const checkIncludes = (filter) => (event) => {
  return event.categories.filter((cat) =>
    cat &&
    cat.title &&
    cat.title.toLowerCase().includes(filter)).length > 0 ||
    event.description.toLowerCase().includes(filter)
}

class Financial extends Component {
  static propTypes = {
    events: PropTypes.array,
    // accountsRetrieved: PropTypes.bool,
    categoriesRetrieved: PropTypes.oneOf(['success', 'inProgress', 'pending', 'error']),
    eventsRetrieved: PropTypes.oneOf(['success', 'inProgress', 'pending', 'error']),
    filterBy: PropTypes.string,
    setLookupParam: PropTypes.func.isRequired,
    lookup_term: PropTypes.string,
    lookup_param: PropTypes.string,
    // populateAccounts: PropTypes.func.isRequired,
    populateCategories: PropTypes.func.isRequired,
    populateEvents: PropTypes.func.isRequired,
    setFilterBy: PropTypes.func.isRequired,
    setLookupTerm: PropTypes.func.isRequired,
    spinnerOverlay: PropTypes.bool
  }

  static defaultProps = {
    events: [],
    eventsRetrieved: 'pending',
    filterBy: '',
    lookup_term: 'month',
    lookup_param: null
  }

  performRetrieval = () => {
    const promises = []
    if (this.props.eventsRetrieved === 'pending') {
      const { lookup_term, lookup_param } = this.props
      promises.push(this.props.populateEvents({lookup_term, lookup_param}))
    }
    if (this.props.categoriesRetrieved === 'pending') {
      promises.push(this.props.populateCategories())
    }
    // if (!this.props.accountsRetrieved) {
    //   this.props.populateAccounts()
    // }
    Promise.all(promises)
  }

  componentDidMount () {
    this.performRetrieval()
  }

  componentDidUpdate () {
    this.performRetrieval()
  }

  render () {
    const { events, filterBy, setFilterBy } = this.props
    let eventList = events
    if (filterBy !== '') {
      const filter = checkIncludes(filterBy.toLowerCase())
      eventList = eventList.filter(filter)
    }
    return (
      <div style={{width: '100%'}}>
        <Heading>Financial</Heading>
        <Summary events={eventList} />
        <div className={styles.searchWrapper}>
          <div>
            <TextInput
              label={'Search'}
              onChange={setFilterBy}
              placeholder="Enter Search..."
              type="search"
              value={filterBy}
              layout="inline"
            />
          </div>
          <Period
            selected={this.props.lookup_term}
            onSelect={this.props.setLookupTerm}
            specified={this.props.lookup_param}
            onSpecification={this.props.setLookupParam}
          />
        </div>
        <div className={styles.historyContainer}>
          <History events={eventList} />
        </div>
        <SpinnerOverlay open={this.props.spinnerOverlay} />
      </div>
    )
  }
}

export default themeable(theme, styles)(Financial)
