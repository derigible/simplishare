// @flow

import React from 'react'

import { List } from '@instructure/ui-elements'
import { Button } from '@instructure/ui-buttons'
import { IconPlusLine } from '@instructure/ui-icons'
import { TextArea } from '@instructure/ui-forms'
import { TextInput } from '@instructure/ui-text-input'

import Page from '../../../components/Page'
import StandardEditModal from '../../../components/StandardEditModal'
import Notification from '../../../resources/User/Notification'

import type { UserType } from '../../../resources/User/type'
import type { Notification as NotificationType } from '../../../resources/User/type'


export default function Inbox (
  {user} : {user: UserType}
) {
  return (
    <Page
      user={user}
      pageName="user/inbox"
    >
      <List variant="unstyled">
        {user.action_items.map(t => <List.Item key={t.id}><Notification notification={t} /></List.Item>)}
      </List>
    </Page>
  )
}
