import PropTypes from 'prop-types'
import React, { Component } from 'react'

import ScreenReaderContent from '@instructure/ui-a11y/lib/ScreenReaderContent'
import TextArea from '@instructure/ui-forms/lib/TextArea'
import Typography from '@instructure/ui-elements/lib/Text'
import themeable from '@instructure/ui-themeable'

import Checkmark from '../Checkmark'
import Delete from '../Delete'

import styles from './styles.css'
import theme from './theme'

class Description extends Component {
  static propTypes = {
    description: PropTypes.string,
    submit: PropTypes.func.isRequired
  }

  static defaultProps = {
    description: ''
  }

  constructor (props) {
    super(props)

    this.state = {
      editDescription: false,
      description: props.description || ''
    }
  }

  handleChangeToEdit = (e) => {
    if (!this.state.editDescription) {
      const changes = { editDescription: true }
      if (e.type === 'keypress') {
        changes.description = this.state.description
      }
      this.setState(changes)
      setTimeout(() => {
        this.textArea.focus()
      })
    }
  }

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value })
  }

  submitDescriptionChange = () => {
    this.props.submit(this.state.description)
    this.setState({ editDescription: false })
  }

  deleteChanges = () => {
    this.setState({
      editDescription: false,
      description: this.props.description
    })
  }

  setTextAreaRef = (node) => { this.textArea = node }

  renderDesc () {
    const { description } = this.props
    if (description) {
      return <Typography>{description}</Typography>
    }
    return <Typography fontStyle="italic">Enter Description...</Typography>
  }

  renderDescEdit () {
    return (
      <div>
        <TextArea
          autoGrow
          label={<ScreenReaderContent>Description</ScreenReaderContent>}
          placeholder="Enter Description..."
          value={this.state.description}
          onChange={this.handleDescriptionChange}
          textareaRef={this.setTextAreaRef}
          onBlur={this.submitDescriptionChange}
        />
        <Checkmark callback={this.submitDescriptionChange} />
        <Delete callback={this.deleteChanges} />
      </div>
    )
  }

  render () {
    const dsc = this.state.editDescription ? this.renderDescEdit() : this.renderDesc()

    return (
      <div
        tabIndex="0"
        onClick={this.handleChangeToEdit}
        className={styles.description}
        onKeyPress={this.handleChangeToEdit}
        role="button"
      >
        {dsc}
      </div>
    )
  }
}

export default themeable(theme, styles)(Description)
