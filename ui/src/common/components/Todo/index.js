import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import ListView from './ListView'
import SubTask from './SubTask'
import * as customPropTypes from '../../propTypes'

export default class Todo extends PureComponent {
  static propTypes = {
    onSelectMenuOpenChange: PropTypes.func.isRequired,
    entity: customPropTypes.todoProps.isRequired,
    hideCompleted: PropTypes.bool.isRequired,
    addTag: PropTypes.func,
    removeTag: PropTypes.func,
    createAndAddTag: PropTypes.func
  }

  setListViewRef = (node) => {
    this.listViewRef = node
  }

  focus () {
    this.listViewRef.getWrappedInstance().focus()
  }

  setTitleRef = (node) => { this.titleRef = node }

  renderSubTasks = (parentChain, entity) => {
    const { onSelectMenuOpenChange, hideCompleted } = this.props

    return (
      <SubTask
        todos={entity.todos}
        onSelectMenuOpenChange={onSelectMenuOpenChange}
        parentChain={parentChain}
        hideCompleted={hideCompleted}
        renderSubTasks={this.renderSubTasks}
      />
    )
  }

  render () {
    const { entity, onSelectMenuOpenChange, removeTag, addTag, createAndAddTag, hideCompleted } = this.props
    return (
      <ListView
        ref={this.setListViewRef}
        onSelectMenuOpenChange={onSelectMenuOpenChange}
        entity={entity}
        removeTag={removeTag}
        addTag={addTag}
        createAndAddTag={createAndAddTag}
        hideCompleted={hideCompleted}
        renderSubTasks={this.renderSubTasks}
      />
    )
  }
}
