// @flow

import axios from 'axios'

import { axiosError } from '../../errors'
import { VirtualEntity } from '../baseRecords'

import { Preferences } from '../baseRecords'
import type { VirtualEntityParams } from '../baseRecords'

type TodoParams = VirtualEntityParams & {
  description: string,
  title: string,
  expanded?: boolean
}

export class Todo extends VirtualEntity {
  static fetching = false
  static list(
    {userId, store} :
    {userId?: string, store: any}
  ) : Array<Todo> {
    if (store.todos) {
      return store.todos
    } else {
      if (!Todo.fetching) {
        Todo.fetching = true
        const url = userId ? `/todos?user_id=${userId}` : '/todos'
        axios.get(url).then(
          response => {
            // eslint-disable-next-line
            store.todos = response.data.map(t => new Todo(t))
            Todo.prototype.callRender()
          }
        ).catch(error => {
          axiosError(error);
        }).finally(() => Todo.fetching = false)
      }
    }
    return []
  }

  description: string
  title: string
  expanded: ?boolean

  constructor(t: TodoParams) {
    super(t)
    this.description = t.description
    this.title = t.title
    this.expanded = !!t.expanded
  }

  get displayName () : string {
    return 'Todo'
  }

  get type () : string {
    return 'todo'
  }

  updateWith (changes: any) {

  }
}

export const defaultTodo = new Todo({
  description: 'This is a default body',
  title: 'My Title',
  id: '1',
  archived: false,
  tags: [],
  shared_on: null,
  shared: false,
  metadata: {},
  preferences: new Preferences({
    email: {
      todo: {
        archive:'not_set',
        update: 'not_set'
      }
    }
  }),
  shared_object_id: '1',
  updated_at: '2019-07-08T12:12:12.001Z',
  created_at: '2019-07-08T12:12:12.001Z',
  priority: 'medium'
})

export function recordParams (state: Todo, newParam: any) {
  return Object.assign(
    {},
    {
      description: state.description,
      title: state.title,
      id: state.id,
      archived: state.archived,
      tags: state.tags,
      shared: state.shared,
      shared_on: state.shared_on,
      metadata: state.metadata,
      preferences: state.preferences,
      shared_object_id: state.shared_object_id,
      updated_at: state.updated_at,
      created_at: state.created_at,
      priority: state.priority
    },
    newParam
  )
}
