// @flow

import axios from 'axios'

import { axiosError } from '../errors'

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
  shared_object_id: string
}

export class Tag {
  static async getTags () {
    try {
      const response = await axios.get('/tags')
      return response.data.map(t => new Tag(t))
    } catch (error) {
      axiosError(error)
    }
  }

  static tags () : any {
    return Tag.prototype.tags
  }

  static setTags (tags: Array<Tag>) {
    const allTagsMap = {}
    tags.forEach(t => (allTagsMap[t.id] = t))
    return Tag.prototype.tags = allTagsMap
  }

  id: string
  name: string
  shared_object_id: string
  ve: VirtualEntity
  tags: any

  constructor(tag: TagParams | Tag, ve?: VirtualEntity) {
    this.id = tag.id
    this.name = tag.name
    this.shared_object_id = tag.shared_object_id
    // $FlowFixMe
    this.ve = ve
  }

  untag = (rerender: any) => {
    if (!this.ve) throw Error('must have ve set to untag')
    return () => {
      this.ve.untag(this)
      rerender()
      axios
        .delete(`/${this.ve.pluralizedType}/${this.ve.id}/tag`, { data: {tag_ids: [this.id]} })
        .then(({data}) => {
          this.ve.setTags(data.tags.map(t => new Tag(t, this.ve)))
          rerender()
        })
        .catch(error => {this.ve.tag({tag: this, rerender}); axiosError(error)})
    }
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
  tags: Array<Tag>,
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
    this.setTags(ve.tags)
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

  get pluralizedType () : string {
    return 'ves'
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

  tag = ({tag, tagId, rerender} : {tagId?: string, tag?: Tag, rerender: any}) => {
    if (tag) {
      this.setTags(this.tags.concat([tag]))
    } else {
      const newTag = new Tag(Tag.tags()[tagId], this)
      this.setTags(this.tags.concat([newTag]))
      rerender()
      axios
        .post(`/${this.pluralizedType}/${this.id}/tag`, {tag_ids: [tagId]})
        .then(({data}) => {
          this.setTags(data.tags.map(t => new Tag(t, this)))
          rerender()
        })
        .catch(error => {this.untag(newTag); axiosError(error)})
    }
  }

  untag = (tag: Tag) => {
    this.setTags(this.tags.filter(t => t.id !== tag.id))
  }

  setTags(tags: Array<Tag>) {
    this.tags = tags.map(t => new Tag(t, this))
  }
}
