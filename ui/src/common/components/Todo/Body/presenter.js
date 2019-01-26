import PropTypes from 'prop-types'
import React, { Component } from 'react'
import difference from 'lodash/difference'

import Flex, { FlexItem } from '@instructure/ui-layout/lib/components/Flex'
import Typography from '@instructure/ui-elements/lib/components/Text'
import ToggleGroup from '@instructure/ui-toggle-details/lib/components/ToggleGroup'
import View from '@instructure/ui-layout/lib/components/View'

import Description from '../../Description'
import Details from '../../Details'
import Share from '../../Share'
import * as customPropTypes from '../../../propTypes'

import Preferences from '../../Preferences'
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
            <FlexItem margin="0 small 0 0">
              <Typography>Title:</Typography>
            </FlexItem>
            <FlexItem grow shrink>
              <Description
                description={entity.title}
                submit={submitTitleChange}
              />
            </FlexItem>
          </Flex>
          <Flex>
            <FlexItem margin="0 small 0 0">
              <Typography>Description:</Typography>
            </FlexItem>
            <FlexItem grow shrink>
              <Description
                description={entity.description}
                submit={submitDescriptionChange}
              />
            </FlexItem>
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
