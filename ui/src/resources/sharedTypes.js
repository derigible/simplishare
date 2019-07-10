// @flow

import type { SharedWithContact, ShareableContact } from './User/type'

export type Metadata = {

}

type action = {
  type: "always" | "not_set" | "never",
  setPreference: any
}

export type PreferenceAction = {
  archive: action,
  update: action
}

export type Preference = {
  todo?: PreferenceAction,
  note?: PreferenceAction
}

export type Preferences = {
  email: Preference
}

export type Tag = {
  id: string,
  name: string,
  shared_object_id: string,
  tag: any,
  untag: any
}

export type TagOption = {
  id: string,
  label: string,
  disabled?: boolean
}

export type VirtualEntity = {
  id: string,
  archived: boolean,
  tags: Array<Tag>,
  tagsAsOptions: Array<TagOption>,
  shared_on: ?string,
  shared: boolean,
  metadata: Metadata,
  preferences: Preferences,
  shared_object_id: string,
  updated_at: string,
  created_at: string,
  priority: string,
  displayName: "Note" | "Todo",
  type: "note" | "todo",
  archive: any,
  shareWith: any,
  snooze: any,
  sharedWith: Array<SharedWithContact>,
  shareableWith: Array<ShareableContact>,
  tag: any,
  untag: any
}
