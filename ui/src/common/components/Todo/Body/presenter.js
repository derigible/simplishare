import PropTypes from 'prop-types'
import React, { Component } from 'react'
import difference from 'lodash/difference'

import { Text as Typography} from '@instructure/ui-elements'
import {ToggleGroup} from '@instructure/ui-toggle-details'
import {Flex, View} from '@instructure/ui-layout'

import Description from '../../Description'
import Details from '../../Details'
import Share from '../../Share'
import * as customPropTypes from '../../../propTypes'

import Preferences from '../../Preferences'
import Snooze from '../../Snooze'
import Destroy from '../Destroy'
import ShareableLink from '../../ShareableLink'

export default class Body extends Component {
  static propTypes = {
    entity: customPropTypes.todoProps.isRequired,
    possibleTags: customPropTypes.possibleTags,
    onSelectMenuOpenChange: PropTypes.func.isRequired,
    addTag: PropTypes.func,
    removeTag: PropTypes.func,
    createAndAddTag: PropTypes.func,
    submitTitleChange: PropTypes.func.isRequired,
    submitDescriptionChange: PropTypes.func.isRequired,
    parentChain: customPropTypes.todoParentChainProps,
    renderSubTasks: PropTypes.func,
    isUpdating: PropTypes.bool,
    updatePreference: PropTypes.func.isRequired
  }

  static defaultProps = {
    isUpdating: true
  }

  get hasParentChain () {
    return this.props.parentChain.length > 1
  }

  handleAddTag = (tag_ids) => {
    const diff = difference(this.props.entity.tags, tag_ids)
    if (diff.length > 0 && this.props.entity.tags.length > 0) {
      this.props.removeTag(this.props.entity.id, diff)
    } else {
      this.props.addTag(this.props.entity.id, tag_ids)
    }
  }

  handleCreateAndAddTag = (name) => {
    this.props.createAndAddTag(this.props.entity.id, name)
  }

  render () {
    const {
      entity,
      possibleTags,
      onSelectMenuOpenChange,
      parentChain,
      submitDescriptionChange,
      submitTitleChange,
      renderSubTasks,
      isUpdating,
      updatePreference
    } = this.props
    return (
      <View as="div" margin="xxx-small" shadow="resting" padding="xx-small">
        <Flex>
            <Flex.Item margin="0 small 0 0">
              <Typography>Title:</Typography>
            </Flex.Item>
            <Flex.Item grow shrink>
              <Description
                description={entity.title}
                submit={submitTitleChange}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item margin="0 small 0 0">
              <Typography>Description:</Typography>
            </Flex.Item>
            <Flex.Item grow shrink>
              <Description
                description={entity.description}
                submit={submitDescriptionChange}
              />
            </Flex.Item>
          </Flex>
          <Flex margin="small none">
            <Flex.Item margin="0 small 0 0">
              <Typography>Actions:</Typography>
            </Flex.Item>
            {!this.hasParentChain
              ? (
                <Flex.Item margin="0 small 0 0">
                  <Snooze
                    entityId={entity.id}
                    entityType="Todo"
                  />
                </Flex.Item>
                )
              : null
            }
            <Flex.Item>
              <Destroy
                entity={entity}
                parentChain={this.props.parentChain}
              />
            </Flex.Item>
          </Flex>
          {renderSubTasks ? renderSubTasks(parentChain, entity) : null }
          {!this.hasParentChain && isUpdating
            ? <ToggleGroup
                toggleLabel="Expand to see sharing information."
                summary="Sharing"
                size="small"
              >
                <Share
                  shareId={entity.id}
                  shareType="Todo"
                  onSelectMenuOpenChange={onSelectMenuOpenChange}
                />
              </ToggleGroup>
            : null
          }
          {!this.hasParentChain && isUpdating
            ? <ToggleGroup
                toggleLabel="Expand to see preferences information."
                summary="Preferences"
                size="small"
              >
                <Preferences
                  preferences={entity.preferences}
                  updatePreference={updatePreference}
                  showRecordType={false}
                />
              </ToggleGroup>
            : null
          }
          {entity.shared
            ? <ShareableLink entity={entity} entityType='todos' />
            : null
          }
          <Details
            createdAt={entity.created_at}
            updatedAt={entity.updated_at}
            possibleTags={possibleTags}
            tags={entity.tags}
            addTag={this.handleAddTag}
            createAndAddTag={this.handleCreateAndAddTag}
            onSelectMenuOpenChange={onSelectMenuOpenChange}
            showTags={!this.hasParentChain}
          />
      </View>
    )
  }
}
