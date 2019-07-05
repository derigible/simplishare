import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import {Button} from '@instructure/ui-buttons'
import {Flex,View} from '@instructure/ui-layout'



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
    hideCompleted: PropTypes.bool.isRequired
  }

  static defaultProps = {
    addTag: () => {},
    createAndAddTag: () => {}
  }

  state = {
    showBody: false
  }

  setArchiveRef = (node) => {
    this.archiveRef = node
  }

  focus () {
    this.archiveRef.getWrappedInstance().focus()
  }

  changePriority = (priority) => {
    this.props.updateEntity(this.props.entity.id, { priority })
  }

  submitDescriptionChange = (description) => {
    this.props.updateEntity(
      this.props.entity.id,
      { description }
    )
  }

  submitTitleChange = (title) => {
    this.props.updateEntity(
      this.props.entity.id,
      { title }
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
      hideCompleted
    } = this.props
    return (
      <View as="div">
        <Flex alignItems="stretch">
          <Flex.Item grow shrink>
            <Button fluidWidth size="small" variant="light" onClick={this.handleBodyShow}>
              <Summary entity={entity} hideCompleted={hideCompleted}/>
            </Button>
          </Flex.Item>
          <Flex.Item>
            <View as="div" margin="none small">
              <Archive
                ref={this.setArchiveRef}
                entity={entity}
              />
            </View>
          </Flex.Item>
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
                hideCompleted={hideCompleted}
              />
            : null
          }
        </div>
      </View>
    )
  }
}
