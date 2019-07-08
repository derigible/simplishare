// @flow

import type { VirtualEntity } from '../sharedTypes'

export type Todo = VirtualEntity & {
  description: string,
  title: string,
  updateWith: any,
  expanded?: boolean
}

export const defaultTodo = {
  description: 'This is a default description',
  title: 'My Title',
  updateWith: () => Promise.resolve,
  expanded: false,
  id: '1',
  archived: false,
  tags: [],
  shared_on: null,
  shared: false,
  metadata: {},
  preferences: [],
  shared_object_id: '1',
  updated_at: '2019-07-08T12:12:12.001Z',
  created_at: '2019-07-08T12:12:12.001Z',
  priority: 'medium'
}
