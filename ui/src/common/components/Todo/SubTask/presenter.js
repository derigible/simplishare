import PropTypes from 'prop-types'
import React, { Component } from 'react'

import ToggleGroup from '@instructure/ui-toggle-details/lib/ToggleGroup'

import AddNew from '../AddNew'
import * as customPropTypes from '../../../propTypes'
import ListView from '../ListView'
import View from '@instructure/ui-layout/lib/View'

export default class SubTask extends Component {
  static propTypes = {
    deletedTodos: customPropTypes.deletedTodosProps,
    todos: PropTypes.arrayOf(customPropTypes.todoProps),
    onSelectMenuOpenChange: PropTypes.func.isRequired,
    updateEntity: PropTypes.func.isRequired,
    parentChain: customPropTypes.todoParentChainProps.isRequired,
    hideCompleted: PropTypes.bool.isRequired,
    renderSubTasks: PropTypes.func.isRequired
  }

  createSubTask = (todo) => {
    this.props.updateEntity('new-sub-task', todo, { parentChain: this.props.parentChain })
  }

  get filteredTodos () {
    const { todos, deletedTodos, hideCompleted } = this.props
    const filtered = todos.filter((t) => !deletedTodos.has(t.id))
    if (hideCompleted) {
      return filtered.filter((t) => t.archived !== true )
    }
    return filtered
  }

  render () {
    const { onSelectMenuOpenChange, hideCompleted, parentChain, renderSubTasks } = this.props
    const toRender = this.filteredTodos
    if (toRender.length === 0) {
      return <AddNew addNew={this.createSubTask} />
    }
    return (
      <ToggleGroup
        toggleLabel="Expand to see subtask information."
        summary="Subtasks"
        size="small"
      >
        <View as="div" margin="x-small">
          {
            toRender.map((entity) =>{
              return <ListView
                key={entity.id}
                entity={entity}
                parentChain={parentChain.concat([entity.id])}
                hideCompleted={hideCompleted}
                onSelectMenuOpenChange={onSelectMenuOpenChange}
                renderSubTasks={renderSubTasks}
              />
            })
          }
          <AddNew addNew={this.createSubTask} />
        </View>
      </ToggleGroup>
    )
  }
}
