import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SelectionManager from '../SelectionManager'
import * as customPropTypes from '../../propTypes'
import { OPEN, SHOW_ONLY_HIGH_PRIORITY, SHOW_ONLY_LOW_PRIORITY, SHOW_ONLY_MEDIUM_PRIORITY} from '../../../constants/tagTypes'

const OTHER_OPTIONS = [
  {
    label: 'Other',
    options: [
      {id: OPEN, name: 'Open'},
      {id: SHOW_ONLY_LOW_PRIORITY, name: 'Low Priority'},
      {id: SHOW_ONLY_MEDIUM_PRIORITY, name: 'Medium Priority'},
      {id: SHOW_ONLY_HIGH_PRIORITY, name: 'High Priority'}
    ]
  }
]

export default class SharedTagSelectionManager extends Component {
  static propTypes = {
    filterOptions: customPropTypes.possibleTags,

    // Should come from the connected component
    createTag: PropTypes.func.isRequired,
    possibleTags: customPropTypes.possibleTags,
    tagsRetrieved: PropTypes.oneOf(['success', 'inProgress', 'pending', 'error']),
    populateTags: PropTypes.func.isRequired,
    selectedTags: PropTypes.arrayOf(customPropTypes.id).isRequired,
    setSelectedTags: PropTypes.func.isRequired
  }

  static defaultProps = {
    filterOptions: [],
    possibleTags: []
  }

  componentDidMount () {
    const promises = []
    if (this.props.tagsRetrieved === 'pending') {
      promises.push(setTimeout(() => this.props.populateTags(), 2000))
    }
    Promise.all(promises)
  }

  get filterOptions () {
    return OTHER_OPTIONS.concat(this.props.possibleTags).concat(this.props.filterOptions)
  }

  handleNewTagDefined = (name) => {
    this.props.createTag({ name })
      .then((tagData) => {
        this.props.setSelectedTags(this.props.selectedTags.concat([tagData.payload[0].id]))
      })
  }

  handleTagSelected = (tags) => {
    this.props.setSelectedTags(tags)
    setTimeout(() => {
      this.selectedTagsToLocalStorage(tags)
    })
  }

  selectedTagsToLocalStorage (tags) {
    localStorage.setItem('selectedTags', JSON.stringify(tags))
  }

  render () {
    return (
      <SelectionManager
        possibleTags={this.filterOptions}
        onSelectTag={this.handleTagSelected}
        onTagDefine={this.handleNewTagDefined}
        selectedTags={this.props.selectedTags}
      />
    )
  }
}
