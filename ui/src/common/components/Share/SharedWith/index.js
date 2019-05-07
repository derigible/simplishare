import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {Checkbox} from '@instructure/ui-forms'
import {Flex} from '@instructure/ui-layout'
import {Text} from '@instructure/ui-elements'

export default class SharedWith extends Component {
  static propTypes = {
    sharedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      email: PropTypes.string.isRequired,
      permissions: PropTypes.arrayOf(PropTypes.oneOf(['archive', 'read', 'edit', 'destroy', 'share', 'owner']))
    }).isRequired,
    setPermissions: PropTypes.func.isRequired
  }

  setPerm (perm) {
    const { user, setPermissions,  user: { permissions } } = this.props
    if (permissions.includes(perm)) {
      const i = permissions.findIndex(p => perm === p)
      const perms = permissions.slice()
      perms.splice(i, 1)
      setPermissions(user.id, perms)
    } else {
      setPermissions(user.id, permissions.concat([perm]))
    }
  }

  setRead = () => {
    this.setPerm('read')
  }

  setEdit = () => {
    this.setPerm('edit')
  }

  setArchive = () => {
    this.setPerm('archive')
  }

  setDestroy = () => {
    this.setPerm('destroy')
  }

  setShare = () => {
    this.setPerm('share')
  }

  renderPerms () {
    const { user: { permissions } } = this.props
    return (
      <Flex.Item shrink grow textAlign="end">
        <Checkbox
          inline
          label="read"
          checked={permissions.includes('read')}
          onChange={this.setRead}
        />
        &nbsp;
        <Checkbox
          inline
          label="edit"
          checked={permissions.includes('edit')}
          onChange={this.setEdit}
        />
        &nbsp;
        <Checkbox
          inline
          label="archive"
          checked={permissions.includes('archive')}
          onChange={this.setArchive}
        />
        &nbsp;
        <Checkbox
          inline
          label="destroy"
          checked={permissions.includes('destroy')}
          onChange={this.setDestroy}
        />
        &nbsp;
        <Checkbox
          inline
          label="share"
          checked={permissions.includes('share')}
          onChange={this.setShare}
        />
      </Flex.Item>
    )
  }

  renderOwner () {
    return <Flex.Item shrink grow textAlign="end"><Text>Owner</Text></Flex.Item>
  }

  render () {
    const { user, user: { permissions } } = this.props
    return (
      <Flex margin="medium 0">
        <Flex.Item>
          <Text>{user.email}</Text>
        </Flex.Item>
        {permissions.includes('owner')
          ? this.renderOwner()
          : this.renderPerms()
        }
      </Flex>
    )
  }
}
