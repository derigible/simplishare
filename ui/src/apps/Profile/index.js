// @flow

import React from 'react'

import { IconUserLine } from '@instructure/ui-icons'
import { View } from '@instructure/ui-layout'
import { Tabs } from '@instructure/ui-tabs'

import PageHeader from '../../components/PageHeader'
import User from '../../resources/User'
import Contacts from '../../resources/User/Contacts'

import type { UserType } from '../../resources/User/type'
import type { ComponentActionType } from '../../constants/actionTypes'

const tabs = {
  user_info: 0,
  contacts: 1
}

// error in webpack with eslint, need to keep so $Keys is not undef
// eslint-disable-next-line no-undef
type TabTypes = $Keys<typeof tabs>;

export default function Profile (
  {user, tab = 'user_info'} : {user: UserType, tab?: TabTypes}
) {
  const [selected: string, setSelected] = React.useState(tabs[tab])

  return (
    <>
      <PageHeader
        breadCrumbs={[{href: '#!profile', linkText: 'Profile', icon: <IconUserLine />}]}
      />
      <Tabs
        onRequestTabChange={(_, { index }) => setSelected(index)}
        margin="none large"
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
            <Contacts contacts={user.contacts}/>
          </View>
        </Tabs.Panel>
      </Tabs>
    </>
  )
}
