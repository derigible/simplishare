// @flow

export type Notification = {
  type: string
}

export type Contact = {
  email: string,
  username: ?string,
  contact_id: string,
  id: string,
  created_at: string
}

export type UserType = {
  display_name: string,
  email: string,
  username: string,
  action_items: Array<Notification>,
  contacts: Array<Contact>,
  addContact: any
}
