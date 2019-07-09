// @flow

export type Notification = {
  type: string,
  id: string
}

export type Contact = {
  email: string,
  username: ?string,
  contact_id: string,
  id: string,
  created_at: string
}

export type SharedWithContact = Contact & {
  access: Array<string>,
  changeAcess: any
}

export type UserType = {
  display_name: string,
  email: string,
  username: string,
  action_items: Array<Notification>,
  contacts: Array<Contact>,
  addContact: any,
  addEntity: any,
  updateWith: any
}

let _id = 0
export function defaultSharedWithContactGenerator (
  {email, username, access = ['read']} : {email: string, username: ?string, access?: Array<string>}
) {
  const id = _id
  _id += 1
  return {
    email: email,
    username: username,
    contact_id: id.toString(),
    id: id.toString(),
    created_at: '2019-07-09T12:12:12.000Z',
    access: access,
    changeAcess: () => Promise.resolve()
  }
}
