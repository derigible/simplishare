// @flow

import React from 'react'

import { List } from '@instructure/ui-elements'
import { Button } from '@instructure/ui-buttons'
import { IconPlusLine, IconUserLine, IconInboxLine } from '@instructure/ui-icons'
import { TextArea } from '@instructure/ui-forms'
import { TextInput } from '@instructure/ui-text-input'

import Page from '../../../components/Page'
import PageHeader from '../../../components/PageHeader'
import StandardEditModal from '../../../components/StandardEditModal'
import Notification from '../../../resources/User/Notification'

import type { User as UserType } from '../../../resources/User/record'
import type { Notification as NotificationType } from '../../../resources/User/record'

const crumbs = [{href: '#!user', linkText: 'User', icon: IconUserLine}, {href: '#!user/inbox', linkText: 'Inbox', icon: IconInboxLine}]

export default function Inbox (
  {user} : {user: UserType}
) {
  return (
    <Page
      user={user}
      pageName="user/inbox"
      pageHeader={
        <PageHeader breadCrumbs={crumbs} />
      }
    >
      <List variant="unstyled">
        {user.notifications.map(t => <List.Item key={t.id}><Notification notification={t} /></List.Item>)}
      </List>
    </Page>
  )
}
