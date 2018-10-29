import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import List from '../../../common/components/List'
import Todo from '../../../common/components/Todo'
import AddNew from '../../../common/components/Todo/AddNew'
import WithSidebar from '../../../common/components/WithSidebar'
import TodoModal from './TodoModal'

import { TODOS_SET_TODOS } from '../../../constants/actionTypes'
import { todoProps, fetchRetrievalStatusProps, deletedTodosProps, id } from '../../../common/propTypes'
import SharedTagSelectionManager from '../../../common/components/SharedTagSelectionManager'


export default class ToDos extends PureComponent {
  static propTypes = {
    createEntity: PropTypes.func.isRequired,
    updateEntity: PropTypes.func.isRequired,
    deletedTodos: deletedTodosProps,
    todos: PropTypes.arrayOf(todoProps),
    todosRetrieved: fetchRetrievalStatusProps,
    populateTodos: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    selectedTags: PropTypes.arrayOf(id)
  }

  static defaultProps = {
    todosRetrieved: 'pending'
  }

  constructor (props) {
    super(props)
    const parts =  window.location.pathname.split('/')
    const id = parts[parts.length - 1]
    const todoId = window.location.pathname.includes('view') && id !== 'new'
      ? parseInt(id, 10)
      : null

    this.state = {
      tags: props.selectedTags,
      open: !!todoId || id === 'new',
      todoId: id === 'new' ? 'new' : todoId
    }
  }

  static getDerivedStateFromProps(props, state) {
    const parts =  window.location.pathname.split('/')
    const id = parts[parts.length - 1]
    const todoId = window.location.pathname.includes('view') && id !== 'new'
      ? parseInt(id, 10)
      : null

    return {
      open: !!todoId || id === 'new',
      todoId: id === 'new' ? 'new' : todoId
    }
  }

  get filteredTodos () {
    return this.props.todos.filter(this.filterTodo)
  }

  createTodo = (focusLast = false) => (tags) => (todo) => {
    return this.props.createEntity(todo, tags())
      .then(() => {
        if (focusLast) {
          setTimeout(() => {
            this.listRef.getWrappedInstance().focusLast()
          })
        }
      })
  }

  updateTodo = (focusLast = false) => (tags) => (id, todo) => {
    return this.props.updateEntity(id, todo, tags())
      .then(() => {
        if (focusLast) {
          setTimeout(() => {
            this.listRef.getWrappedInstance().focusLast()
          })
        }
      })
  }

  startAddEntity = (tags) => {
    this.setState({tags, open: true, todoId: 'new'})
    this.props.navigateTo('/todos/view/new')
  }

  closeTodo = () => {
    this.setState({open: false})
    this.props.navigateTo('/todos')
  }

  quickCreateEntity = (tags) => {
    return <AddNew addNew={this.createTodo(true)(tags)} />
  }

  filterTodo = (todo) => {
    return !this.props.deletedTodos.has(todo.id)
  }

  setListRef = (node) => { this.listRef = node }

  render () {
    const { todosRetrieved, populateTodos } = this.props
    return (
      <WithSidebar
        content={<div>
          <SharedTagSelectionManager />
        </div>}
      >
        <TodoModal
          createTodo={this.createTodo()}
          updateTodo={this.updateTodo()}
          closeTodo={this.closeTodo}
          tags={this.state.tags}
          open={this.state.open}
          todoId={this.state.todoId}
          todosRetrieved={todosRetrieved}
        />
        <List
          entities={this.filteredTodos}
          entitiesRetrieved={todosRetrieved}
          populateEntities={populateTodos}
          startAddEntity={this.startAddEntity}
          startAddEntityLabel="Add Todo"
          componentType={Todo}
          tagEntityActionType={TODOS_SET_TODOS}
          quickCreateEntity={this.quickCreateEntity}
          ref={this.setListRef}
          hideBorder
        />
      </WithSidebar>
    )
  }
}
