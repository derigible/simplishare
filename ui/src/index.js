// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import theme from '@instructure/canvas-theme'
import axios from 'axios'

import { defaultTodo } from './resources/Todo/record'
import { defaultNote } from './resources/Note/record'

import type { Note as NoteType } from './resources/Note/record'
import type { Todo as TodoType } from './resources/Todo/record'
import type { User as UserType } from './resources/User/record'
import { User } from './resources/User/record'

import configureRouter from './router'

theme.use()

const mountPoint = document.getElementById('app')

type PropsType = {
  user: ?User,
  todos?: Array<TodoType>,
  notes?: Array<NoteType>
}

const router = configureRouter()
axios.defaults.headers.common['Accept'] = 'application/json'

User.info().then((user: ?User) => {
  const store = {
    getProps: function(app) {
      const props: PropsType = { user }
      if (app === 'todos') {
        props.todos = [defaultTodo,]
      }
      if (app === 'notes') {
        props.notes = [defaultNote]
      }

      return props
    }
  }

  function renderView(View, app) {
    const props = store.getProps(app)
    return <View {...props} />
  }

  if (mountPoint !== null) {
    router.on('route', async (_, routing) => {
      const { view, app } = await routing

      ReactDOM.render(
        renderView(view, app),
        mountPoint
      )
    }).start()
  }
}).catch(error => {
  // eslint-disable-next-line no-console
  console.log(error)
})
