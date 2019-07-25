// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import theme from '@instructure/canvas-theme'
import axios from 'axios'

import { axiosError } from './errors'

import { defaultTodo } from './resources/Todo/record'
import { defaultNote } from './resources/Note/record'

import type { Note as NoteType } from './resources/Note/record'
import type { Todo as TodoType } from './resources/Todo/record'
import type { User as UserType } from './resources/User/record'
import { User } from './resources/User/record'
import { BaseRecord, Tag, VirtualEntity } from './resources/baseRecords'

import configureRouter from './router'

theme.use()

const mountPoint = document.getElementById('app')

type PropsType = {
  user: ?User,
  todos?: Array<TodoType>,
  notes?: Array<NoteType>,
  createTodo: any,
  createNote: any,
}

const router = configureRouter()
axios.defaults.headers.common['Accept'] = 'application/json'

function Provider ({View, store}) {
  const [toggle, callRender] = React.useState(true)

  const props = store(() => {
    callRender(!toggle)
  })
  return <View {...props} toggle={toggle}/>
}

const store = {}

function createEntityCreator(Record) {
  return function (params, rerender) {
    const type = Record.pluralizedType()
    axios.post(`/${type}`, { [Record.type()] : { ...params, priority: 'medium' }})
      .then(
        response => {
          const record: VirtualEntity = new Record(response.data)
          store[type] = (store[type] || []).concat([record])
          rerender(record)
        }
      ).catch(error => axiosError(error))
  }
}

Tag.getTags()
  .then((tags: Array<Tag>) => Tag.setTags(tags))
  .catch(error => {
    // eslint-disable-next-line
    if (error.name === 'UserNotAuthenticated') console.log(error)
    else throw error
  })

User.info().then((user: User) => {
  store.user = user
  function makeStore (app: string, records: any) {
    return function (callRender: any) {
      // eslint-disable-next-line
      BaseRecord.prototype.callRender = callRender
      const props : any = { user }
      if (app === 'todos') {
        props.todos = store.todos || records.todo.list({store})
        props.createTodo = createEntityCreator(records.todo)
      }
      if (app === 'notes') {
        props.notes = store.notes || records.note.list({store})
        props.createNote = createEntityCreator(records.note)
      }

      return props
    }
  }

  if (mountPoint !== null) {
    router.on('route', async (_, routing) => {
      const { view, app, records } = await routing

      ReactDOM.render(
        <Provider View={view} store={makeStore(app, records)} />,
        mountPoint
      )
    }).start()
  }
}).catch(error => {
  if (error.name === 'UserNotAuthenticated') window.location = '/auth/identity'
  // eslint-disable-next-line
  console.log(error)
})
