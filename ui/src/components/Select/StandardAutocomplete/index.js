// @flow

import * as React from 'react'
import keycode from 'keycode'

import { IconUserLine, IconSearchLine, IconUserSolid } from '@instructure/ui-icons'
import { Select } from '@instructure/ui-select'
import { Alert } from '@instructure/ui-alerts'

export interface Option {
  id: string,
  label: string,
  disabled: boolean
}

type expectedProps = {
  options: Array<Option>,
  setSelected: any,
  iconBefore?: React.ComponentType<*>,
  label: React.Node,
  onOptionCreate?: any,
  ignoreOptionCreateValues? : Array<string>
}

type State = {
  inputValue: string,
  isShowingOptions: boolean,
  highlightedOptionId: ?string,
  selectedOptionId: ?string,
  filteredOptions: Array<Option>,
  announcement: ?string
}

export default class StandardAutocomplete extends React.Component<expectedProps, State> {
  state = {
    inputValue: '',
    isShowingOptions: false,
    highlightedOptionId: null,
    selectedOptionId: null,
    filteredOptions: this.props.options,
    announcement: null
  }

  getOptionById (queryId: string) : ?Option {
    return this.props.options.find(({ id }) => id === queryId)
  }

  getOptionsChangedMessage (newOptions: Array<Option>) {
    let message = newOptions.length !== this.state.filteredOptions.length
      ? `${newOptions.length} options available.` // options changed, announce new total
      : null // options haven't changed, don't announce
    if (message && newOptions.length > 0) {
      // options still available
      if (this.state.highlightedOptionId !== newOptions[0].id) {
        // highlighted option hasn't been announced
        const option = this.getOptionById(newOptions[0].id)
        const optionLabel = (option && option.label) || ''
        message = `${optionLabel}. ${message}`
      }
    }
    return message
  }

  filterOptions = (value: string) => {
    return (this.props.options.filter(option => (
      option.label.toLowerCase().startsWith(value.toLowerCase())
    )) : Array<Option>)
  }

  matchValue () {
    const {
      filteredOptions,
      inputValue,
      highlightedOptionId,
      selectedOptionId
    } = this.state

    // an option matching user input exists
    if (filteredOptions.length === 1) {
      const onlyOption = filteredOptions[0]
      // automatically select the matching option
      if (onlyOption.label.toLowerCase() === inputValue.toLowerCase()) {
        return {
          inputValue: onlyOption.label,
          selectedOptionId: onlyOption.id,
          filteredOptions: this.filterOptions('')
        }
      }
    }
    // allow user to return to empty input and no selection
    if (inputValue.length === 0) {
      return { selectedOptionId: null }
    }
    // no match found, return selected option label to input
    if (selectedOptionId) {
      const selectedOption = this.getOptionById(selectedOptionId)
      return { inputValue: selectedOption && selectedOption.label }
    }
    // input value is from highlighted option, not user input
    // clear input, reset options
    if (highlightedOptionId) {
      const highlightedOption = this.getOptionById(highlightedOptionId)
      if (inputValue === (highlightedOption && highlightedOption.label)) {
        return {
          inputValue: '',
          filteredOptions: this.filterOptions('')
        }
      }
    }
  }

  handleShowOptions = (event: any) => {
    this.setState(({ filteredOptions }) => ({
      isShowingOptions: true,
      announcement: `List expanded. ${filteredOptions.length} options available.`
    }))
  }

  handleHideOptions = (event: any) => {
    const { selectedOptionId, inputValue } = this.state
    this.setState({
      isShowingOptions: false,
      highlightedOptionId: null,
      announcement: 'List collapsed.',
      ...this.matchValue()
    })
  }

  handleBlur = (event: any) => {
    this.setState({ highlightedOptionId: null })
  }

  handleHighlightOption = (event: any, { id }: {id: string}) => {
    event.persist()
    const option = this.getOptionById(id)
    if (!option) return // prevent highlighting of empty option
    this.setState((state) => ({
      highlightedOptionId: id,
      inputValue: event.type === 'keydown' ? option.label : state.inputValue,
      announcement: option.label
    }))
  }

  handleSelectOption = (event: any, { id }: {id: string}) => {
    const option = this.getOptionById(id)
    if (!option) return // prevent selecting of empty option
    this.setState({
      selectedOptionId: id,
      inputValue: option.label,
      isShowingOptions: false,
      filteredOptions: this.props.options,
      announcement: `${option.label} selected. List collapsed.`
    })
    this.props.setSelected(id)
  }

  handleInputChange = (event: any) => {
    const value = event.target.value
    const newOptions = this.filterOptions(value)
    this.setState((state) => ({
      inputValue: value,
      filteredOptions: newOptions,
      highlightedOptionId: newOptions.length > 0 ? newOptions[0].id : null,
      isShowingOptions: true,
      selectedOptionId: value === '' ? null : state.selectedOptionId,
      announcement: this.getOptionsChangedMessage(newOptions)
    }))
  }

  handleOptionCreate = (e: any) => {
    if(keycode.isEventKey(e, 'enter')) {
      const ignoreValues = this.props.ignoreOptionCreateValues ? this.props.ignoreOptionCreateValues : []
      if (
        e.target.value.length > 0
        && !ignoreValues.includes(e.target.value)
        && !this.state.highlightedOptionId
      ) {
        const cb = this.props.onOptionCreate ? this.props.onOptionCreate : (_) => {}
        cb(e.target.value)
        this.handleHideOptions(e)
      }
    }
  }

  render () {
    const {
      inputValue,
      isShowingOptions,
      highlightedOptionId,
      selectedOptionId,
      filteredOptions,
      announcement
    } = this.state

    const IconBefore = this.props.iconBefore || IconUserSolid

    return (
      <div>
        <Select
          renderLabel={this.props.label}
          assistiveText="Type or use arrow keys to navigate options."
          placeholder="Start typing to search..."
          inputValue={inputValue}
          isShowingOptions={isShowingOptions}
          onBlur={this.handleBlur}
          onInputChange={this.handleInputChange}
          onRequestShowOptions={this.handleShowOptions}
          onRequestHideOptions={this.handleHideOptions}
          onRequestHighlightOption={this.handleHighlightOption}
          onRequestSelectOption={this.handleSelectOption}
          renderBeforeInput={<IconBefore inline={false} />}
          renderAfterInput={<IconSearchLine inline={false} />}
          onKeyDown={this.handleOptionCreate}
        >
          {filteredOptions.length > 0 ? filteredOptions.map((option) => {
            return (
              <Select.Option
                id={option.id}
                key={option.id}
                isHighlighted={option.id === highlightedOptionId}
                isSelected={option.id === selectedOptionId}
                isDisabled={option.disabled}
                renderBeforeLabel={IconBefore}
              >
                {!option.disabled
                  ? option.label
                  : `${option.label} (unavailable)`
                }
              </Select.Option>
            )
          }) : (
            <Select.Option
              id="empty-option"
              key="empty-option"
            >
              ---
            </Select.Option>
          )}
        </Select>
        <Alert
          liveRegion={() => document.getElementById('alertHolder')}
          liveRegionPoliteness="assertive"
          screenReaderOnly
        >
          { announcement }
        </Alert>
      </div>
    )
  }
}
