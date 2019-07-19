// @flow
import { VirtualEntity } from '../baseRecords'

import { Preferences } from '../baseRecords'
import type { VirtualEntityParams } from '../baseRecords'

type NoteParams = VirtualEntityParams & {
  body: string,
  title: string,
  expanded?: boolean
}

export class Note extends VirtualEntity {
  body: string
  title: string
  expanded: ?boolean

  constructor(t: NoteParams) {
    super(t)
    this.body = t.body
    this.title = t.title
    this.expanded = !!t.expanded
  }

  get displayName () : string {
    return 'Note'
  }

  get type () : string {
    return 'note'
  }

  updateWith (changes: any) {

  }
}

export const defaultNote = new Note({
  body: 'This is a default body',
  title: 'My Title',
  id: '1',
  archived: false,
  tags: [],
  shared_on: null,
  shared: false,
  metadata: {},
  preferences: new Preferences({
    email: {
      note: {
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
