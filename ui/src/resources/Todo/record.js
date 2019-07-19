// @flow

import { VirtualEntity } from '../baseRecords'

import { Preferences } from '../baseRecords'
import type { VirtualEntityParams } from '../baseRecords'

type TodoParams = VirtualEntityParams & {
  description: string,
  title: string,
  expanded?: boolean
}

export class Todo extends VirtualEntity {
  description: string
  title: string
  expanded: ?boolean

  constructor(t: TodoParams) {
    super(t)
    this.description = t.description
    this.title = t.title
    this.expanded = !!t.expanded
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
