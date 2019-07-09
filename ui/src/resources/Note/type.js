// @flow

import type { VirtualEntity } from '../sharedTypes'

import { defaultSharedWithContactGenerator } from '../User/type'

export type Note = VirtualEntity & {
  body: string,
  title: string,
  updateWith: any,
  expanded?: boolean
}

export const defaultNote = {
  body: 'This is a default body',
  title: 'My Title',
  updateWith: () => Promise.resolve,
  id: '1',
  archived: false,
  tags: [],
  shared_on: null,
  shared: false,
  metadata: {},
  preferences: {
    email: {
      note: {
        archive: {
          type: 'not_set',
          setPreference: () => Promise.resolve()
        },
        update: {
          type: 'not_set',
          setPreference: () => Promise.resolve()
        }
      }
    }
  },
  shared_object_id: '1',
  updated_at: '2019-07-08T12:12:12.001Z',
  created_at: '2019-07-08T12:12:12.001Z',
  priority: 'medium',
  displayName: 'Note',
  type: 'note',
  sharedWith: [
    defaultSharedWithContactGenerator({email: 'derigible@outlook.com', username: 'lookme'}),
    defaultSharedWithContactGenerator({email: 'pmarca@outlook.com', username: null, access: ['read', 'share']})
  ],
  archive: () => Promise.resolve(),
  shareWith: () => Promise.resolve()
}
