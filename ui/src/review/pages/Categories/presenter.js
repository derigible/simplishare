import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select from '@instructure/ui-forms/lib/Select'
import themeable from '@instructure/ui-themeable/lib/themeable'

import Chrome from '../../../common/components/Chrome'
import History from '../../../common/components/History'
import Period from '../../../common/components/Period'
import Summary from '../../../common/components/Summary'

import CategoryRecord from '../../../records/Category'
import LineGraph from '../../../common/components/LineGraph'

import styles from './styles.css'
import theme from './theme'

class Categories extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryRecord)),
    categoriesRetrieved: PropTypes.bool,
    eventsRetrieved: PropTypes.bool,
    lookup_param: PropTypes.string,
    lookup_term: PropTypes.string,
    populateCategories: PropTypes.func.isRequired,
    populateCategoryEvents: PropTypes.func.isRequired,
    setLookupParam: PropTypes.func.isRequired,
    setLookupTerm: PropTypes.func.isRequired
  }

  static defaultProps = {
    categories: [],
    categoriesRetrieved: false,
    eventsRetrieved: false,
    filterBy: '',
    lookup_term: 'month'
  }

  state = {
    selectedCategoryId: -1
  }

  componentDidMount () {
    if (!this.props.categoriesRetrieved) {
      this.props.populateCategories()
    }
  }

  handleCategoryChange = (event) => {
    const categoryId = event.target.value
    this.setState({
      selectedCategoryId: categoryId
    })
    const { populateCategoryEvents, lookup_param, lookup_term } = this.props
    populateCategoryEvents(
      {
        categoryId,
        lookup_term,
        lookup_param
      }
    )
  }

  handleLookupTermChange = (lookup_term) => {
    this.props.setLookupTerm(lookup_term)
    const { populateCategoryEvents, lookup_param } = this.props
    populateCategoryEvents(
      {
        categoryId: this.state.selectedCategoryId,
        lookup_term,
        lookup_param
      }
    )
  }

  handleLookupParamChange = (lookup_param) => {
    this.props.setLookupParam(lookup_param)
    const { populateCategoryEvents, lookup_term } = this.props
    populateCategoryEvents(
      {
        categoryId: this.state.selectedCategoryId,
        lookup_term,
        lookup_param
      }
    )
  }

  transformDate (date) {
    const parts = date.split('-')
    return `${parts[1]}/${parts[0]}`
  }

  render () {
    const { selectedCategoryId } = this.state
    const { categories } = this.props
    const category = this.props.categories.find((c) => c.id === selectedCategoryId) || {events: []}
    return <Chrome>
      <div className={styles.middleWrapper}>
        <div className={styles.selectWrapper}>
          <Select
            label="Category"
            value={selectedCategoryId + ''}
            onChange={this.handleCategoryChange}
            layout="inline"
          >
            {selectedCategoryId === -1 && <option>--</option>}
            {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </div>
        <Period
          selected={this.props.lookup_term}
          onSelect={this.handleLookupTermChange}
          specified={this.props.lookup_param}
          onSpecification={this.handleLookupParamChange}
        />
      </div>
      <LineGraph
        data={category.events.reverse()}
        scopes={[`categories.${category.title}`]}
        xValueTransform={this.transformDate}
      />
      <Summary events={category.events} />
      <div className={styles.historyContainer}>
        <History events={category.events} />
      </div>
    </Chrome>
  }
}

export default themeable(theme, styles)(Categories)
