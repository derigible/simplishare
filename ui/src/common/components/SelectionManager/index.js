import React, { Component } from 'react'
import keycode from 'keycode'
import isEqual from 'lodash/isEqual'

import Select from '@instructure/ui-forms/lib/Select'
import { selectionManagerProps } from '../../propTypes'

class SelectionManager extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.possibleTags.length !== nextProps.possibleTags.length
      || this.props.possibleTags.some((tags, i) => {
        return tags.length === nextProps.possibleTags[i].length
      })
      || !isEqual(this.props.selectedTags, nextProps.selectedTags)
  }

  get possibleTags () {
    return this.props.possibleTags.reduce((tagGroups, currentTagGroup) => {
      if (currentTagGroup.options.length > 0) {
        return tagGroups.concat([currentTagGroup])
      }
      return tagGroups
    }, [])
  }

  handleSelectionDefine = (e) => {
    if(keycode.isEventKey(e, 'enter')) {
      if (
        e.target.value.length > 0
        && !this.props.possibleTags.includes(e.target.value)
      ) {
        this.props.onTagDefine(e.target.value)
        e.target.value = null // eslint-disable-line no-param-reassign
      }
    }
  }

  handleSelection = (e, tags) => {
    if (e === null) { return }
    this.props.onSelectTag(
      tags.map((tag) =>  tag.id)
    )
  }

  renderOptions () {
    const possibleTags = this.possibleTags
    const optionRender = (opt) => (
      <option key={opt.id} value={`${opt.id}`}>
        {opt.name}
      </option>
    )
    if (possibleTags.length === 1) {
      return possibleTags[0].options.map(optionRender)
    }
    return possibleTags.map((group) => {
      return <optgroup label={group.label} key={group.label}>
        {
          group.options.map(optionRender)
        }
      </optgroup>
    })
  }

  render () {
    const { selectedTags, label } = this.props
    return (
      <Select
        editable
        multiple
        onOpen={this.props.onMenuOpenChange}
        onClose={this.props.onMenuOpenChange}
        onChange={this.handleSelection}
        onKeyDown={this.handleSelectionDefine}
        label={label}
        optionsMaxWidth="3rem"
        selectedOption={selectedTags.map((t) => `${t}`)}
        stacking="topmost"
      >
        {
          this.renderOptions()
        }
      </Select>
    )
  }
}

SelectionManager.propTypes = selectionManagerProps

SelectionManager.defaultProps = {
  label: 'Filters',
  selectedTags: [],
  onMenuOpenChange: () => {}
}

export default SelectionManager
