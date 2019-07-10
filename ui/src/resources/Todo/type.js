// @flow

import type { VirtualEntity } from '../sharedTypes'

import { defaultSharedWithContactGenerator } from '../User/type'

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
  tags: [{id: '1', name: 'test', shared_object_id: '1', tag: () => Promise.resolve(), untag: () => Promise.resolve()}],
  shared_on: null,
  shared: false,
  metadata: {},
  preferences: {
    email: {
      todo: {
        archive: {
          type: 'not_set',
          setPreference: () => Promise.resolve()
        },
        update: {
          type: 'always',
          setPreference: () => Promise.resolve()
        }
      }
    }
  },
  shared_object_id: '1',
  updated_at: '2019-07-08T12:12:12.001Z',
  created_at: '2019-07-08T12:12:12.001Z',
  priority: 'medium',
  displayName: 'Todo',
  type: 'todo',
  sharedWith: [
    defaultSharedWithContactGenerator({email: 'derigible@outlook.com', username: 'lookme'}),
    defaultSharedWithContactGenerator({email: 'pmarca@outlook.com', username: null, access: ['read', 'share']})
  ],
  shareableWith: [
    {
      id: '11',
      label: 'marc.alan.phillips@outlook.com'
    }
  ],
  archive: () => Promise.resolve,
  shareWith: () => Promise.resolve,
  snooze: () => Promise.resolve,
}
