// @flow

import type { SharedWithContact, ShareableContact } from './User/record'
import type { Option } from '../components/Select/StandardAutocomplete'

export type Metadata = {

}

class Action  {
  type: "always" | "not_set" | "never"

  constructor(type: "always" | "not_set" | "never") {
    this.type = type
  }

  setPreference () {

  }
}

type PreferenceActionParams = {
  archive: "always" | "not_set" | "never",
  update: "always" | "not_set" | "never"
}

export class PreferenceAction {
  archive: Action
  update: Action

  constructor(a: PreferenceActionParams) {
    this.archive = new Action(a.archive)
    this.update = new Action(a.update)
  }
}

type PreferenceParams = {
  todo?: PreferenceActionParams,
  note?: PreferenceActionParams
}

export class Preference  {
  todo: PreferenceAction
  note: PreferenceAction

  constructor(p: PreferenceParams) {
    if (p.todo) {
      this.todo = new PreferenceAction(p.todo)
    }
    if (p.note) {
      this.note = new PreferenceAction(p.note)
    }
  }
}

type PreferencesParams = {
  email: PreferenceParams
}

export class Preferences {
  email: Preference

  constructor(preferences: PreferencesParams) {
    this.email = new Preference(preferences.email)
  }
}

type TagParams = {
  id: string,
  name: string,
  shared_object_id: string,
  tag: any,
  untag: any
}

export class Tag {
  id: string
  name: string
  shared_object_id: string

  constructor(tag: TagParams) {
    this.id = tag.id
    this.name = tag.name
    this.shared_object_id = tag.shared_object_id
  }

  tag () {

  }

  untag () {

  }
}

type TagOption = {
  id: string,
  label: string,
  disabled: boolean
}

export type VirtualEntityParams = {
  id: string,
  archived: boolean,
  tags: ?Array<Tag>,
  tagsAsOptions?: Array<TagOption>,
  shared_on: ?string,
  shared: boolean,
  metadata: Metadata,
  preferences: Preferences,
  shared_object_id: string,
  updated_at: string,
  created_at: string,
  priority: string,
  _sharedWith?: Array<SharedWithContact>,
  _shareableWith?: Array<ShareableContact>
}

function createTagsAsOptions(tags: Array<Tag>) {
  return tags.map(t => ({id: t.id, label: t.name, disabled: false}))
}

export class VirtualEntity {
  id: string
  archived: boolean
  tags: Array<Tag>
  tagsAsOptions: Array<TagOption>
  shared_on: ?string
  shared: boolean
  metadata: Metadata
  preferences: Preferences
  shared_object_id: string
  updated_at: string
  created_at: string
  priority: string
  _sharedWith: ?Array<SharedWithContact>
  _shareableWith: ?Array<ShareableContact>

  constructor(ve: VirtualEntityParams) {
    this.id = ve.id
    this.archived = ve.archived
    this.tags = ve.tags || []
    this.tagsAsOptions = ve.tagsAsOptions || createTagsAsOptions(ve.tags || [])
    this.shared_on = ve.shared_on
    this.shared = ve.shared
    this.metadata = ve.metadata
    this.preferences = ve.preferences
    this.shared_object_id = ve.shared_object_id
    this.updated_at = ve.updated_at
    this.created_at = ve.created_at
    this.priority = ve.priority
    this._shareableWith = ve._shareableWith
    this._sharedWith = ve._sharedWith
  }

  get displayName () : string {
    return 'Virtual Entity'
  }

  get type () : string {
    return 've'
  }

  get sharedWith () : Array<SharedWithContact> {
    return []
  }

  get shareableWith () : Array<Option> {
    return []
  }

  archive () {

  }

  shareWith (userId: string, perms: Array<string>) {

  }

  snooze () {

  }

  tag (tagId: string) {

  }

  untag () {

  }
}
