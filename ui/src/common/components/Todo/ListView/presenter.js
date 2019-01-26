import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Button from '@instructure/ui-buttons/lib/components/Button'
import Flex, { FlexItem } from '@instructure/ui-layout/lib/components/Flex'

import View from '@instructure/ui-layout/lib/components/View'

import Actions from '../../Actions'
import Snooze from '../../Snooze'
import Archive from '../Archive'
import Destroy from '../Destroy'
import Summary from '../Summary'
import Body from '../Body'
import Priority from '../../Priority'
import * as customPropTypes from '../../../propTypes'

export default class ListView extends PureComponent {
  static propTypes = {
    onSelectMenuOpenChange: PropTypes.func.isRequired,
    entity: customPropTypes.todoProps.isRequired,
    addTag: PropTypes.func,
    removeTag: PropTypes.func,
    createAndAddTag: PropTypes.func,
    updateEntity: PropTypes.func.isRequired,
    parentChain: customPropTypes.todoParentChainProps,
    hideCompleted: PropTypes.bool.isRequired,
    renderSubTasks: PropTypes.func
  }

  static defaultProps = {
    addTag: () => {},
    createAndAddTag: () => {},
    parentChain: []
  }

  state = {
    showBody: false
  }

  get parentChain () {
    if (this.props.parentChain.length === 0) {
      return [this.props.entity.id]
    }
    return this.props.parentChain
  }

  setPriorityRef = (node) => {
    this.priorityRef = node
  }

  focus () {
    this.priorityRef.focus()
  }

  changePriority = (priority) => {
    this.props.updateEntity(this.props.entity.id, { priority }, {parentChain: this.parentChain })
  }

  submitDescriptionChange = (description) => {
    this.props.updateEntity(
      this.props.entity.id,
      { description },
      {parentChain: this.parentChain }
    )
  }

  submitTitleChange = (title) => {
    this.props.updateEntity(
      this.props.entity.id,
      { title },
      {parentChain: this.parentChain }
    )
  }

  setTitleRef = (node) => { this.titleRef = node }

  handleBodyShow = () => {
    this.setState({showBody: !this.state.showBody})
  }

  render () {
    const {
      entity,
      onSelectMenuOpenChange,
      removeTag,
      addTag,
      createAndAddTag,
      renderSubTasks,
      hideCompleted
    } = this.props
    return (
      <View as="div">
        <Flex alignItems="stretch">
          <FlexItem padding="xxx-small 0 0 0">
            <Priority
              priority={entity.priority}
              changePriority={this.changePriority}
              ref={this.setPriorityRef}
            />
          </FlexItem>
          <FlexItem grow shrink>
            <Button fluidWidth size="small" variant="light" onClick={this.handleBodyShow}>
              <Summary entity={entity} hideCompleted={hideCompleted}/>
            </Button>
          </FlexItem>
          <FlexItem>
            <Actions>
              {this.parentChain.length === 1
                ? (
                    <View as="div" margin="small none">
                      <Snooze
                        entityId={entity.id}
                        entityType="Todo"
                      />
                    </View>
                  )
                : null
              }
              <View as="div" margin="small none">
                <Archive
                  entity={entity}
                  parentChain={this.parentChain}
                />
              </View>
              <View as="div">
                <Destroy
                  entity={entity}
                  parentChain={this.parentChain}
                />
              </View>
            </Actions>
          </FlexItem>
        </Flex>
        <div style={{display: this.state.showBody ? 'block' : 'none'}}>
          {this.state.showBody
            ? <Body
                entity={entity}
                onSelectMenuOpenChange={onSelectMenuOpenChange}
                addTag={addTag}
                removeTag={removeTag}
                createAndAddTag={createAndAddTag}
                submitDescriptionChange={this.submitDescriptionChange}
                submitTitleChange={this.submitTitleChange}
                parentChain={this.parentChain}
                hideCompleted={hideCompleted}
                renderSubTasks={renderSubTasks}
              />
            : null
          }
        </div>
      </View>
    )
  }
}
