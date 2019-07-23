// @flow

import type { SharedWithContact, ShareableContact } from './User/record'
import type { Option } from '../components/Select/StandardAutocomplete'

export class BaseRecord {
  callRender = () => { throw Error('Did not set callRender!')}
}

BaseRecord.prototype.callRender = () => {}

export type Metadata = {

}

interface Indexable {
  [key: string]: string
}

class Action  {
  type: "always" | "not_set" | "never" | Action

  constructor(type: "always" | "not_set" | "never" | Action) {
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

  constructor(a: PreferenceActionParams | PreferenceAction) {
    this.archive = new Action(a.archive)
    this.update = new Action(a.update)
  }
}

type PreferenceParams = {
  todo?: PreferenceActionParams,
  note?: PreferenceActionParams
}

export class Preference implements Indexable  {
  todo: PreferenceAction
  note: PreferenceAction

  $key: any;
  $value: any;

  constructor(p: PreferenceParams | Preference) {
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

export class Preferences implements Indexable {
  email: Preference
  $key: any;
  $value: any;

  constructor(preferences: PreferencesParams | Preferences) {
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

export class VirtualEntity extends BaseRecord{
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
    super()
    this.id = ve.id
    this.archived = ve.archived
    this.tags = ve.tags || []
    this.tagsAsOptions = ve.tagsAsOptions || createTagsAsOptions(ve.tags || [])
    this.shared_on = ve.shared_on
    this.shared = ve.shared
    this.metadata = ve.metadata
    this.preferences = new Preferences(ve.preferences)
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

  snooze (datetime: string) {

  }

  tag (tagId: string) {

  }

  untag () {

  }
}
