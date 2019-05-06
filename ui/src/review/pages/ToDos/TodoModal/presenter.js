import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Modal, { ModalHeader, ModalBody, ModalFooter } from '@instructure/ui-overlays/lib/Modal'
import Button from '@instructure/ui-buttons/lib/Button'
import Heading from '@instructure/ui-elements/lib/Heading'

import Body from '../../../../common/components/Todo/Body'
import SubTask from '../../../../common/components/Todo/SubTask'
import { id, todoProps, fetchRetrievalStatusProps } from '../../../../common/propTypes'
import Spinner from '@instructure/ui-elements/lib/Spinner'

const baseTodo = (tags) => ({
  id: 'tempId',
  priority: 'medium',
  title: 'Untitled Todo',
  description: '',
  created_at: new Date(Date.now()).toISOString(),
  updated_at: new Date(Date.now()).toISOString(),
  tags,
  todos: []
})

export default class TodoModal extends Component {
  static propTypes = {
    createTodo: PropTypes.func,
    updateTodo: PropTypes.func,
    entity: todoProps,
    closeTodo: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tags: PropTypes.arrayOf(id),
    createTag: PropTypes.func.isRequired,
    todosRetrieved: fetchRetrievalStatusProps,
    todoId: id
  }

  static getDerivedStateFromProps(props, state) {
    if (props.open !== state.open) {
      return {
        todo: props.entity || baseTodo(props.tags),
        open: props.open
      }
    } else if (props.entity && props.entity.id !== state.todo.id) {
      return {
        todo: props.entity
      }
    }
    return null
  }

  constructor (props) {
    super(props)
    this.state = {
      todo: props.entity || baseTodo([]),
      open: false
    }
  }

  get canEdit () {
    return this.state.todo.metadata
      && (
        this.state.todo.metadata.permissions.includes('edit')
        || this.state.todo.metadata.permissions.includes('owner')
      )
  }

  get isUpdating () {
    return !!this.state.todo.metadata
  }

  get isReading () {
    return this.state.todo.metadata && this.state.todo.metadata.permissions && !this.state.todo.metadata.permissions.includes('edit')
  }

  get isLoading () {
    return Number.isInteger(this.props.todoId) && !['success', 'error'].includes(this.props.todosRetrieved)
  }

  get isLoadingError () {
    return Number.isInteger(this.props.todoId) && this.props.todosRetrieved === 'error'
  }

  get isEntityNotFound () {
    return !this.isLoading && !this.props.entity && this.props.todoId !== 'new'
  }

  noop = () => {}

  updateTodo (updates) {
    const todo = Object.assign({}, this.state.todo, updates)
    this.setState({todo})
  }

  handleAddTag = (tags) => {
    this.updateTodo({tags})
  }

  handleRemoveTag = (tags) => {
    this.updateTodo({tags})
  }

  handleDescriptionChange = (description) => {
    this.updateTodo({description})
  }

  handleTitleChange = (title) => {
    this.updateTodo({title})
  }

  handleNewTagDefined = (name) => {
    this.props.createTag({ name })
      .then((tagData) => {
        this.updateTodo({tags: this.state.todo.tags.concat([tagData.payload[0].id])})
      })
  }

  handleClose = () => {
    this.props.closeTodo()
  }

  handleSaveTodo = () => {
    const todo = {
      priority: this.state.todo.priority,
      title: this.state.todo.title,
      description: this.state.todo.description
    }
    if (this.isUpdating) {
      this.props.updateTodo(() => this.state.todo.tags)(this.state.todo.id, todo)
        .then(() => {
          this.handleClose()
        }, () => {})
    } else {
      this.props.createTodo(() => this.state.todo.tags)(todo)
      .then(() => {
        this.handleClose()
      }, () => {})
    }
  }

  modalLabel () {
    if (this.isLoadingError) {
      return 'Loading Error'
    } else if (this.isEntityNotFound) {
      return 'Not Found'
    } else if (this.isLoading) {
      return 'Loading Todos...'
    } else if (this.canEdit) {
      return 'Update Todo'
    } else if (this.isReading) {
      return 'Read Todo'
    }
    return 'Create Todo'
  }

  renderSubTasks = (parentChain, entity) => {
    return (
      <SubTask
        todos={entity.todos}
        onSelectMenuOpenChange={this.noop}
        parentChain={parentChain}
        hideCompleted={false}
        renderSubTasks={this.renderSubTasks}
      />
    )
  }

  renderModalBody () {
    if (this.isLoadingError) {
      return <Heading level="h3">Problem loading entity</Heading>
    }
    if (this.isEntityNotFound){
      return <Heading level="h3">Entity not found.</Heading>
    }
    if (this.isLoading) {
      return <Spinner title="Loading data" size="large"/>
    }
    return <Body
      entity={this.state.todo}
      onSelectMenuOpenChange={this.noop}
      addTag={this.handleAddTag}
      removeTag={this.handleRemoveTag}
      createAndAddTag={this.handleNewTagDefined}
      submitDescriptionChange={this.handleDescriptionChange}
      submitTitleChange={this.handleTitleChange}
      parentChain={[this.state.todo.id]}
      hideCompleted={false}
      isUpdating={this.isUpdating}
      renderSubTasks={this.isUpdating ? this.renderSubTasks : null}
    />
  }

  render () {
    const { open } = this.props
    const label = this.modalLabel()
    return (
      <Modal
        open={open}
        onDismiss={this.handleClose}
        label={label}
        size="large"
        shouldCloseOnDocumentClick
      >
        <ModalHeader>
          <Heading as="h2">{label}</Heading>
        </ModalHeader>
        <ModalBody>
          {this.renderModalBody()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleClose}>
          {this.isReading ? 'Done' : 'Cancel'}
          </Button>
          {this.isReading
            ? null
            : <Button disabled={this.isLoading} variant="primary" onClick={this.handleSaveTodo} margin="none none none small">
              Save Todo
            </Button>
          }

        </ModalFooter>
      </Modal>
    )
  }
}
