// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import theme from '@instructure/canvas-theme'

import Page from './components/Page'
import Profile from './apps/Profile'
import Home from './apps/Home'
import Todos from './apps/Todos'
import Notes from './apps/Notes'
import { defaultTodo } from './resources/Todo/type'
import { defaultNote } from './resources/Note/type'

import configureRouter from './router'

theme.use()

const mountPoint = document.getElementById('app')
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
  ],
  addContact: () => Promise.resolve(),
  addEntity: (type, entity) => Promise.resolve(),
  updateWith: () => Promise.resolve()
}

const store = {
  getProps: function(app) {
    const props = { user }
    if (app === 'todos') {
      props.todos = [defaultTodo, Object.assign({}, defaultTodo, {id: '2'})]
    }
    if (app === 'notes') {
      props.notes = [defaultNote, Object.assign({}, defaultNote, {id: '2'})]
    }

    return props
  }
}

function renderView(View, app) {
  const props = store.getProps(app)
  return <View {...props} />
}

const router = configureRouter()

if (mountPoint !== null) {
  router.on('route', async (_, routing) => {
    const { view, app } = await routing

    ReactDOM.render(
      renderView(view, app),
      mountPoint
    )
  }).start()
}
