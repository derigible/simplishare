import React, { Component } from 'react'
import PropTypes from 'prop-types'
import difference from 'lodash/difference'

import Button from '@instructure/ui-buttons/lib/components/Button'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'
import View from '@instructure/ui-layout/lib/components/View'
import IconAdd from '@instructure/ui-icons/lib/Line/IconAdd'

import ListItem from '../ListItem'
import SharedTagSelectionManager from '../SharedTagSelectionManager'
import * as customPropTypes from '../../propTypes'
import { OPEN, SHOW_ONLY_HIGH_PRIORITY, SHOW_ONLY_LOW_PRIORITY, SHOW_ONLY_MEDIUM_PRIORITY} from '../../../constants/tagTypes'

const NON_TAGS = [OPEN, SHOW_ONLY_LOW_PRIORITY, SHOW_ONLY_MEDIUM_PRIORITY, SHOW_ONLY_HIGH_PRIORITY]

export default class List extends Component {
  static propTypes = {
    entities: PropTypes.arrayOf(PropTypes.object),
    entitiesRetrieved: PropTypes.oneOf(['success', 'inProgress', 'pending', 'error']),
    populateEntities: PropTypes.func.isRequired,
    startAddEntity: PropTypes.func.isRequired,
    startAddEntityLabel: PropTypes.string.isRequired,
    componentType: PropTypes.func.isRequired,
    tagEntityActionType: PropTypes.string.isRequired,
    quickCreateEntity: PropTypes.func,
    hideBorder: PropTypes.bool,

    // Should come from the connected component
    tagEntity: PropTypes.func.isRequired,
    createTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    possibleTags: customPropTypes.possibleTags,
    selectedTags: PropTypes.arrayOf(customPropTypes.id).isRequired
  }

  static defaultProps = {
    possibleTags: [],
    hideBorder: false
  }

  componentDidMount () {
    if (this.props.entitiesRetrieved === 'pending') {
      this.props.populateEntities()
    }
  }

  get hideCompleted () {
    return this.props.selectedTags.includes(OPEN)
  }

  get tagIdsToFilterBy () {
    return this.props.selectedTags.filter(t_id => !NON_TAGS.includes(t_id))
  }

  get filteredEntities () {
    return this.props.entities.filter(this.filterEntity)
  }

  get onlyLowPriority () {
    return this.props.selectedTags.includes(SHOW_ONLY_LOW_PRIORITY)
  }

  get onlyMedPriority () {
    return this.props.selectedTags.includes(SHOW_ONLY_MEDIUM_PRIORITY)
  }

  get onlyHighPriority () {
    return this.props.selectedTags.includes(SHOW_ONLY_HIGH_PRIORITY)
  }

  selectedUserDefinedTags = () => {
    return this.props.selectedTags.filter((t) => this.props.possibleTags[0].options.find((tag) => tag.id === t))
  }

  filterEntity = (entity) => {
    if (
       (this.hideCompleted && (!!entity.archived || !!entity.archived))
    || this.onlyLowPriority && entity.priority !== 'low'
    || this.onlyMedPriority && entity.priority !== 'medium'
    || this.onlyHighPriority && entity.priority !== 'high'
    || (
          this.tagIdsToFilterBy.length > 0
          && !(entity.tags.length > 0 && difference(this.tagIdsToFilterBy, entity.tags).length === 0)
        )
      ) {
      return false
    }
    return true
  }

  handleEntityDefinesTag = (id, tag_name) => {
    this.props.createTag({ name: tag_name })
      .then((tagData) => {
        this.props.tagEntity({type: this.props.tagEntityActionType, payload: [{ id }] }, [tagData.payload[0].id])
      })
  }

  handleEntityTagging = (id, tag_ids) => {
    this.props.tagEntity({type: this.props.tagEntityActionType, payload: [{ id }] }, tag_ids)
  }

  handleEntityTagRemoval = (id, tag_ids) => {
    this.props.removeTag({type: this.props.tagEntityActionType, payload: [{ id }] }, tag_ids)
  }

  handleStartEntityAdd = () => {
    this.props.startAddEntity(this.selectedUserDefinedTags())
  }

  focusLast = () => {
    this[`entityRef${this.filteredEntities[this.filteredEntities.length -1].id}`]
      .getWrappedInstance().focus()
  }

  setEntityRef = (id) => (node) => {
    this[`entityRef${id}`] = node
  }

  renderBody () {
    const {
      startAddEntityLabel,
      componentType,
      possibleTags,
      hideBorder
    } = this.props
    const Entity = componentType
    return (
      <View as="div">
        <Button
          variant="primary"
          onClick={this.handleStartEntityAdd}
          margin="small 0"
          icon={IconAdd}
        >
          {startAddEntityLabel}
        </Button>
        {
          this.filteredEntities.map((entity) => {
            return <ListItem
              key={entity.id}
              hideBorder={hideBorder}
              renderChildren={
                (onSelectMenuOpenChange) => {
                  return (
                    <Entity
                      onSelectMenuOpenChange={onSelectMenuOpenChange}
                      entity={entity}
                      possibleTags={possibleTags}
                      addTag={this.handleEntityTagging}
                      removeTag={this.handleEntityTagRemoval}
                      createAndAddTag={this.handleEntityDefinesTag}
                      hideCompleted={this.hideCompleted}
                      ref={this.setEntityRef(entity.id)}
                    />
                  )
                }
              }
            />
          })
        }
        {
          this.props.quickCreateEntity(this.selectedUserDefinedTags)
        }
      </View>
    )
  }

  render () {
    const { entitiesRetrieved } = this.props
    return entitiesRetrieved !== 'success'
      ? (
        <View as="div" textAlign="center">
          <Spinner title="Loading data" size="large"/>
        </View>
      )
      : this.renderBody()
  }
}