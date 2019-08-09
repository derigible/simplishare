// @flow

import React from 'react'

import { IconUserLine, IconGroupLine } from '@instructure/ui-icons'
import { View } from '@instructure/ui-layout'
import { Tabs } from '@instructure/ui-tabs'

import PageHeader from '../../components/PageHeader'
import Page from '../../components/Page'
import User from '../../resources/User'
import Contacts from '../../resources/User/Contacts'

import type { User as UserType } from '../../resources/User/record'
import type { ComponentActionType } from '../../constants/actionTypes'

const tabs = {
  user_info: 0,
  contacts: 1
}

// error in webpack with eslint, need to keep so $Keys is not undef
// eslint-disable-next-line no-undef
type TabTypes = $Keys<typeof tabs>;

const breadCrumbs = (tab: number) => {
  const crumbs = [{href: '#!user', linkText: 'User', icon: IconUserLine}]
  if (tab === tabs.contacts) {
    crumbs.push({href: '#!user/contacts', linkText: 'Contacts', icon: IconGroupLine})
  }
  return crumbs
}

export default function Profile (
  {user, tab = 'user_info'} : {user: UserType, tab?: TabTypes}
) {
  const [selected: string, setSelected] = React.useState(tabs[tab])
  const [toggle, setRerender] = React.useState(false)

  const rerender = () => setRerender(!toggle)

  return (
    <Page
      user={user}
      pageName="user"
      pageHeader={
        <PageHeader breadCrumbs={breadCrumbs(selected)} />
      }
    >
      <Tabs
        onRequestTabChange={(_, { index }) => setSelected(index)}
      >
        <Tabs.Panel
          id='user_info'
          selected={selected === tabs.user_info}
          renderTitle="User Information"
        >
          <View as="div">
            <User user={user}/>
          </View>
        </Tabs.Panel>
        <Tabs.Panel
          id='contacts'
          selected={selected === tabs.contacts}
          renderTitle="Contacts"
        >
          <View as="div">
            <Contacts contacts={user.contacts(rerender)} addContact={user.addContact} />
          </View>
        </Tabs.Panel>
      </Tabs>
    </Page>
  )
}
