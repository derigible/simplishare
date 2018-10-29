import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Checkbox from '@instructure/ui-forms/lib/components/Checkbox'
import Flex, {FlexItem} from '@instructure/ui-layout/lib/components/Flex'
import Text from '@instructure/ui-elements/lib/components/Text'

export default class SharedWith extends Component {
  static propTypes = {
    sharedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      email: PropTypes.string.isRequired,
      permissions: PropTypes.arrayOf(PropTypes.oneOf(['read', 'edit', 'destroy', 'share', 'owner']))
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

  setDestroy = () => {
    this.setPerm('destroy')
  }

  setShare = () => {
    this.setPerm('share')
  }

  renderPerms () {
    const { user: { permissions } } = this.props
    return (
      <FlexItem shrink grow textAlign="end">
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
      </FlexItem>
    )
  }

  renderOwner () {
    return <FlexItem shrink grow textAlign="end"><Text>Owner</Text></FlexItem>
  }

  render () {
    const { user, user: { permissions } } = this.props
    return (
      <Flex margin="medium 0">
        <FlexItem>
          <Text>{user.email}</Text>
        </FlexItem>
        {permissions.includes('owner')
          ? this.renderOwner()
          : this.renderPerms()
        }
      </Flex>
    )
  }
}
