// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import theme from '@instructure/canvas-theme'

import Page from './components/Page'
import Profile from './apps/Profile'

theme.use()

const app = document.getElementById('app')
const user = {
  display_name: 'Roger Rabbit',
  action_items: [{type: 'a'}],
  email: 'derigible@gmail.com',
  username: 'derigible',
  contacts: [
    {
      id: '1',
      created_at: '2019-07-06T12:00:01:001Z',
      contact_id: '1',
      email: 'mphillips@outlook.com',
      username: 'mphillips'
    },
    {
      id: '3',
      created_at: '2019-07-06T12:00:01:001Z',
      contact_id: '3',
      email: 'derigible@outlook.com',
      username: 'outlookme'
    },
    {
      id: '2',
      created_at: '2019-07-06T12:00:01:001Z',
      contact_id: '2',
      email: 'mphillips@instructure.com',
      username: null
    }
  ]
}

if (app !== null) {
  ReactDOM.render(
    <Page
      user={user}
      pageName="home"
    >
      <Profile user={user}/>
    </Page>,
    app
  )
}
