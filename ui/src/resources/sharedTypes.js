// @flow

export type Metadata = {

}

export type Preference = {

}

export type VirtualEntity = {
  id: string,
  archived: boolean,
  tags: Array<string>,
  shared_on: ?string,
  shared: boolean,
  metadata: Metadata,
  preferences: Array<Preference>,
  shared_object_id: string,
  updated_at: string,
  created_at: string,
  priority: string
}
