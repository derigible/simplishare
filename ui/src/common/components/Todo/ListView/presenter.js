import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Button from '@instructure/ui-buttons/lib/Button'
import Flex, { FlexItem } from '@instructure/ui-layout/lib/Flex'

import View from '@instructure/ui-layout/lib/View'

import Archive from '../Archive'
import Summary from '../Summary'
import Body from '../Body'
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

  setArchiveRef = (node) => {
    this.archiveRef = node
  }

  focus () {
    this.archiveRef.getWrappedInstance().focus()
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
          <FlexItem grow shrink>
            <Button fluidWidth size="small" variant="light" onClick={this.handleBodyShow}>
              <Summary entity={entity} hideCompleted={hideCompleted}/>
            </Button>
          </FlexItem>
          <FlexItem>
            <View as="div" margin="none small">
              <Archive
                ref={this.setArchiveRef}
                entity={entity}
                parentChain={this.parentChain}
              />
            </View>
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
