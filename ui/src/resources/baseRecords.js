// @flow

import axios from 'axios'

import { axiosError } from '../errors'

import { SharedWithContact, ShareableContact } from './User/record'
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
  ve: VirtualEntity
  notificationType: string
  recordType: string
  action: string

  constructor(
    type: "always" | "not_set" | "never" | Action,
    ve: VirtualEntity,
    notificationType: string,
    recordType: string,
    action: string
  ) {
    this.type = type
    this.ve = ve
    this.notificationType = notificationType
    this.recordType = recordType
    this.action = action
  }

  setPreference = (value: string, rerender: any) => {
    this.ve.setPreference(this, value, rerender)
  }
}

type PreferenceActionParams = {
  archive: "always" | "not_set" | "never",
  update: "always" | "not_set" | "never",
  $key: any,
  $value: any
}

export class PreferenceAction {
  $key: any;
  $value: any;

  constructor(
    a: PreferenceActionParams | PreferenceAction,
    ve: VirtualEntity,
    notificationType: string,
    recordType: string
  ) {
    Object.keys(a).forEach(
      k => this[k] = new Action(a[k], ve, notificationType, recordType, k)
    )
  }
}

type PreferenceParams = {
  todo?: PreferenceActionParams,
  note?: PreferenceActionParams
}

export class Preference implements Indexable  {
  $key: any;
  $value: any;

  constructor(
    p: PreferenceParams | Preference,
    ve: VirtualEntity,
    notificationType: string
  ) {
    Object.keys(p).forEach(
      // $FlowFixMe
      k => this[k] = new PreferenceAction(p[k], ve, notificationType, k)
    )
  }
}

export class Preferences implements Indexable {
  $key: any;
  $value: any;

  constructor(preferences: any | Preferences, ve: VirtualEntity) {
    Object.keys(preferences).forEach(k => this[k] = new Preference(preferences[k], ve, k))
  }

  get data () {
    const preferences = {}
    Object.keys(this).forEach(
      k => {
        preferences[k] || (preferences[k] = {})
        Object.keys(this[k]).forEach(
          j => {
            preferences[k][j] || (preferences[k][j] = {})
            Object.keys(this[k][j]).forEach(
              a => {
                preferences[k][j][a] = this[k][j][a].type
              }
            )
          }
        )
      }
    )
    return preferences
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

  static createTag(name: string, rerender: any) {
    return axios
      .post('/tags', { tag: { name } })
      .then(({data}) => {
        Tag.prototype.tags[data.id] = new Tag(data)
        rerender()
        return data
      })
      .catch(error => axiosError(error))
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

export function retrieve(url: string, status: string, setStatus: any, success: any, passthrough: Array<any>) : Array<any>{
  if (status === 'pending') {
    setStatus('fetching')
    axios.get(url).then((response) => {success(response); setStatus('success')})
      .catch(error => {
        axiosError(error)
        setStatus('error')
      })
    return []
  }
  return passthrough
}

export class VirtualEntity extends BaseRecord {
  static getSharedWith (
    {ve, rerender} : { ve: VirtualEntity, rerender: any}
  ) : Array<SharedWithContact> {
    const url = `/${ve.pluralizedType}/${ve.id}/shared_with`
    const setStatus = (s) => ve.getSharedWithStatus = s // eslint-disable-line no-param-reassign
    const success = (response) => {
      ve.setSharedWith(
        response.data.map(c => new SharedWithContact(c))
      )
      rerender()
    }
    return retrieve(url, ve.getSharedWithStatus, setStatus, success, ve._sharedWith)
  }

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
  _sharedWith: Array<SharedWithContact>
  _shareableWith: Array<ShareableContact>
  hide: boolean
  getSharedWithStatus: string
  getShareableWithStatus: string

  constructor(ve: VirtualEntityParams) {
    super()
    this.id = ve.id
    this.archived = ve.archived
    this.setTags(ve.tags)
    this.shared_on = ve.shared_on
    this.shared = ve.shared
    this.metadata = ve.metadata
    this.preferences = new Preferences(ve.preferences, this)
    this.shared_object_id = ve.shared_object_id
    this.updated_at = ve.updated_at
    this.created_at = ve.created_at
    this.priority = ve.priority
    this._shareableWith = ve._shareableWith || []
    this._sharedWith = ve._sharedWith || []
    this.hide = false
    this.getShareableWithStatus = 'pending'
    this.getSharedWithStatus = 'pending'
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

  sharedWith (rerender: any) : Array<SharedWithContact> {
    return VirtualEntity.getSharedWith({ve: this, rerender})
  }

  shareableWith (rerender: any) : Array<Option> {
    return []
  }

  archive (update_shared: boolean = false) {
    this.hide = true
    VirtualEntity.prototype.callRender()
    axios
      .put(
        `/${this.pluralizedType}/${this.id}/archive`,
        {
          [this.type]: {
            update_shared
          }
        }
      )
      .catch(error => {
        this.hide = false
        VirtualEntity.prototype.callRender()
        axiosError(error)
      })
  }

  shareWith (userId: string, perms: Array<string>) {

  }

  snooze (snooze_until: string) {
    this.hide = true
    VirtualEntity.prototype.callRender()
    axios
      .put(
        `/${this.pluralizedType}/${this.id}/snooze`,
        {
          snooze: {
            snooze_until
          }
        }
      )
      .catch(error => {
        this.hide = false
        VirtualEntity.prototype.callRender()
        axiosError(error)
      })
  }

  tag = ({tag, tagId, rerender} : {tagId?: string, tag?: Tag, rerender: any}) => {
    if (tag) { // used for untag failure or optimistic rendering
      this.setTags(this.tags.concat([tag]))
    } else {
      if (!tagId || this.tags.map(t => t.id).includes(tagId)) return

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

  setSharedWith(contacts: Array<SharedWithContact>) {
    this._sharedWith = contacts
  }

  setPreference = (action: Action, value: string, rerender: any) => {
    const oldPrefs = this.preferences
    const newPrefs = Object.assign({}, this.preferences.data)
    newPrefs[action.notificationType][action.recordType][action.action] = value
    this.preferences = new Preferences(newPrefs, this)
    rerender()
    axios
      .put(`/${this.pluralizedType}/${this.id}/preferences`,
        {
          preference: {
            preference_type: action.notificationType,
            record_type: action.recordType,
            action: action.action,
            preference: value
          }
        }
      )
      .then(({data}) => {
        this.preferences = new Preferences(data.preferences, this)
        rerender()
      })
      .catch(error => {this.preferences = oldPrefs; rerender(); axiosError(error)})
  }
}
