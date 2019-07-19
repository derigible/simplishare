// @flow

import * as React from 'react'

import { Grid } from '@instructure/ui-layout'
import { View } from '@instructure/ui-layout'
import { Billboard } from '@instructure/ui-billboard'
import { capitalizeFirstLetter } from '@instructure/ui-utils'
import { IconRubricLine, IconComposeLine } from '@instructure/ui-icons'

import Page from '../../components/Page'

import type { User as UserType } from '../../resources/User/record'

function ActionCard ({type, Icon}: {type: string, Icon: any}) {
  return (
    <View
      as="div"
      width="20rem"
      borderWidth="small"
      borderRadius="medium"
      shadow="above"
      display="inline-block"
      margin="medium"
    >
      <Billboard
        message={`View ${capitalizeFirstLetter(type)}`}
        size="large"
        href={`#!${type}`}
        hero={(size) => <Icon size={size} />}
      />
    </View>
  )
}

export default function Home (
  {user} : {user: UserType}
) {
  return (
    <Page
      user={user}
      pageName="home"
    >
      <ActionCard type="todos" Icon={IconRubricLine}/>
      <ActionCard type="notes" Icon={IconComposeLine}/>
    </Page>
  )
}
