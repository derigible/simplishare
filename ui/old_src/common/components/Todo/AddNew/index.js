import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'

import {TextInput} from '@instructure/ui-forms'
import {Button} from '@instructure/ui-buttons'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import { Text as Typography} from '@instructure/ui-elements'
import {IconPlusLine} from '@instructure/ui-icons'

import Checkmark from '../../Checkmark'
import Priority from '../../Priority'

import styles from './styles.css'
import theme from './theme'
import {themeable} from '@instructure/ui-themeable'

class AddNew extends Component {
  static propTypes = {
    addNew: PropTypes.func.isRequired,
    addNewText: PropTypes.string
  }

  static defaultProps = {
    addNewText: 'Add new todo...'
  }

  state = {
    adding: false,
    priority: 'medium'
  }

  addNew = () => {
    this.props.addNew({ title: this.text.value, priority: this.state.priority })
    this.text.value = ''
    this.setState({ adding: false, priority: 'medium' })
  }

  handlePriority = (priority) => {
    this.setState({ priority })
  }

  startNew = () => {
    this.setState({ adding: !this.state.adding })
    setTimeout(() => { this.textInput.focus() })
  }

  setTextInputRef = (node) => {
    this.textInput = node
  }

  setInputRef = (node) => {
    this.text = node
  }

  setSelectRef = (node) => {
    this.select = node
  }

  render () {
    return (
      <div className={styles.addNew}>
        <Button icon={IconPlusLine} variant="icon" onClick={this.startNew} margin="none x-small none none">
          <ScreenReaderContent>Add new</ScreenReaderContent>
        </Button>
        <div
          className={classnames({ [styles.hidden]: this.state.adding })}
          onClick={this.startNew}
          onKeyPress={this.startNew}
          role="button"
          tabIndex={-1}
        >
          <Typography>{this.props.addNewText}</Typography>
        </div>
        <div className={
          classnames({
            [styles.addNew]: true,
            [styles.grow]: true,
            [styles.hidden]: !this.state.adding
          })
        }>
          <Priority priority={this.state.priority} changePriority={this.handlePriority} />
          <TextInput
            ref={this.setTextInputRef}
            label={<ScreenReaderContent>Add new Todo</ScreenReaderContent>}
            inputRef={this.setInputRef}
          />
          <Checkmark callback={this.addNew} />
        </div>
      </div>
    )
  }
}

export default themeable(theme, styles)(AddNew)
