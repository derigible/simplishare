import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Button from '@instructure/ui-buttons/lib/components/Button'
import Heading from '@instructure/ui-elements/lib/components/Heading'
import Text from '@instructure/ui-elements/lib/components/Text'
import View from '@instructure/ui-layout/lib/components/View'

import SelectionManager from '../SelectionManager'
import SharedWith from './SharedWith'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'
import Link from '@instructure/ui-elements/lib/components/Link'

export default class Share extends Component {
  static propTypes = {
    shareId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onShare: PropTypes.func.isRequired,
    shareableWith: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      email: PropTypes.string.isRequired
    })),
    shareType: PropTypes.string.isRequired,
    sharedWith: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      email: PropTypes.string.isRequired,
      permissions: PropTypes.arrayOf(PropTypes.oneOf(['archive', 'read', 'edit', 'destroy', 'share', 'owner'])),
      share_restricted: PropTypes.bool,
      owner: PropTypes.bool
    })),
    fetchShareableWith: PropTypes.func.isRequired,
    fetchSharedWith: PropTypes.func.isRequired,
    onSelectMenuOpenChange: PropTypes.func
  }

  static defaultProps = {
    onMount: () => {},
    onSelectMenuOpenChange: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      selectedUsers: this.props.sharedWith && this.props.sharedWith.map(user => Object.assign({}, user)),
      size: 'auto',
      changed: false
    }
  }

  componentDidMount () {
    const promises = []
    if (!this.props.shareableWith && !this.stopTryingShareableFetch) {
      promises.push(this.props.fetchShareableWith({id: parseInt(this.props.shareId, 10)}))
      this.stopTryingShareableFetch = true
    }
    if (this.needsLoading) {
      promises.push(this.props.fetchSharedWith({id: parseInt(this.props.shareId, 10)}))
      this.stopTryingSharedFetch = true
    }
    Promise.all(promises)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.selectedUsers) {
      this.setState({selectedUsers: nextProps.sharedWith})
    }
  }

  get needsLoading () {
    return !this.props.sharedWith && !this.stopTryingSharedFetch
  }

  get canShare () {
    const shareableWith = this.shareableWith
    // If you have people to share with than you are the owner or have share permissions
    if (shareableWith.length > 0 || (shareableWith.length > 0 && this.sharedWith.length === 0)) { return true }

    const current_user = this.sharedWith.find(shared => !shared.permissions.includes('owner'))
    // If you have only one contact and that person hasn't been shared with yet
    if (this.props.shareableWith && this.props.shareableWith.length === 1 && current_user) { return true }
    // If you have the share permissions but no shared contacts than shared_with will include
    // yourself and the owner. Sharewith will also have you and the owner if you don't have
    // share permissions, so we check to make sure it isn't that scenario
    return current_user && current_user.permissions.includes('share')
  }

  get sharedWith () {
    return this.state.selectedUsers || []
  }

  get shareableWith () {
    return this.props.shareableWith
      ? this.props.shareableWith.filter(
          (user) => {
            return !(this.state.selectedUsers || []).find((sw) => {
              return sw.id === user.id
            })
          }
        )
      : []
  }

  handleOnShare = () => {
    this.props.onShare(
      this.props.shareId,
      this.state.selectedUsers.map(user => ({id: user.contact_id || user.id, permissions: user.permissions})),
      () => {this.setState({changed: false})}
    )
  }

  handleSetPermissions = (userId, permissions) => {
    const userIndex = this.state.selectedUsers.findIndex(user => user.id === userId)
    const user = Object.assign({}, this.state.selectedUsers[userIndex], { permissions })
    const selectedUsers = this.state.selectedUsers.slice()
    selectedUsers.splice(userIndex, 1, user)
    this.setState({ selectedUsers, changed: true })
  }

  handleShareSelect = (userIds) => {
    const sharedWith = userIds.map((user_id) => (
      Object.assign({}, this.props.shareableWith.find((c) => c.id === user_id), {permissions: ['read']})
    ))
    this.setState({selectedUsers: this.state.selectedUsers.concat(sharedWith), changed: true})
  }

  handleTagDefine = () => {}

  renderShareWith () {
    return (
      <View as="div" margin="x-small">
        <Heading level="h4" border="bottom" margin="0 0 small 0">Shared With</Heading>
        {
          this.sharedWith.map((user) => {
            return <SharedWith
              key={user.id}
              user={user}
              sharedId={this.props.shareId}
              setPermissions={this.handleSetPermissions}
            />
          })
        }
        <SelectionManager
          possibleTags={
            [{
              label: 'Users',
              options: this.shareableWith.map(c => ({name: c.email, id: c.id}))
            }]
          }
          onSelectTag={this.handleShareSelect}
          onTagDefine={this.handleTagDefine}
          onMenuOpenChange={this.props.onSelectMenuOpenChange}
          label="Select User"
        />
        <Button
          onClick={this.handleOnShare}
          variant="primary"
          margin="small 0 0 0"
          disabled={!this.state.changed}
        >
          Share
        </Button>
      </View>
    )
  }

  renderSharedBy () {
    return <Text>Shared by: {(this.props.sharedWith && this.props.sharedWith.find(u => u.owner) || {}).email}</Text>
  }

  renderLoadingOrResults () {
    if ((!this.props.sharedWith || !this.props.shareableWith) && (typeof this.stopTryingSharedFetch === 'undefined' || this.stopTryingSharedFetch)) {
      return <Spinner title="Loading" />
    }
    const canShare = this.canShare
    if (canShare) {
      return this.renderShareWith()
    }
    if (this.shareableWith.length === 0 && this.sharedWith.length === 2 && canShare) {
      return <Text>No shared contacts found with the owner. Visit <Link href="/admin/contacts">Contacts</Link> to view contacts.</Text>
    }
    if (this.shareableWith.length === 0 && this.sharedWith.length === 0) {
      return <Text>No contacts found. Go to <Link href="/admin/contacts">Contacts</Link> to add people to share with!</Text>
    }
    return this.renderSharedBy()
  }

  render () {
    return (
      <View as="div">
        {this.renderLoadingOrResults()}
      </View>
    )
  }
}
