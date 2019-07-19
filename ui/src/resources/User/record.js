// @flow

import axios from 'axios'

import { axiosError } from '../../errors'

export class Contact {
  email: string
  username: ?string
  contact_id: string
  id: string
  created_at: string

  constructor(contact: Contact) {
    this.email = contact.email
    this.username = contact.username
    this.contact_id = contact.contact_id
    this.id = contact.id
    this.created_at = contact.created_at
  }
}

export class SharedWithContact extends Contact {
  access: Array<string>

  constructor(c: SharedWithContact) {
    super(c)
    this.access = c.access
  }

  changeAccess (access: string) : void{

  }
}

export class ShareableContact extends Contact {
  id: string
  label: string
  disabled: ?boolean

  constructor(c: ShareableContact) {
    super(c)
    this.label = c.label
    this.disabled = c.disabled
  }
}

export class Notification {
  type: string
  id: string

  constructor(notification: Notification) {
    this.type = notification.type
    this.id = notification.id
  }
}

type UserParamsType = {
  display_name: string,
  email: string,
  username: string,
  _notifications?: Array<Notification>,
  _contacts?: Array<Contact>,
  notificationsFetched: boolean,
  contactsFetched: boolean
}

export class User {
  static async info (userId: ?string) {
    const url = userId ? `/users/${userId}` : '/users/info'
    try {
      const response = await axios.get(url)
      return new User(response.data)
    } catch (error) {
      axiosError(error)
    }
  }

  static getContacts(user: User, userId: ?string) : Array<Contact> {
    const url = userId ? `/users/${userId}/contacts` : '/users/contacts'
    if (!user.contactsFetched) {
      axios.get(url).then(
        response => user.setContacts(
          response.data.map(c => new Contact(c))
        )
      ).catch(error => axiosError(error))
      return []
    }
    return user._contacts
  }

  static getNotifications(user: User, userId: ?string) : Array<Notification> {
    const url = userId ? `/users/${userId}/notification` : '/users/notifications'
    if (!user.notificationsFetched) {
      axios.get(url).then(
        response => user.setNotifications(
          response.body.map(n => new Notification(n))
        )
      ).catch(error => axiosError(error))
      return []
    }
    return user._notifications
  }

  display_name: string
  email: string
  username: string
  _notifications: Array<Notification>
  notificationsFetched: boolean
  contactsFetched: boolean
  _contacts: Array<Contact>
  addContact: any
  addEntity: any
  updateWith: any

  constructor(user: UserParamsType) {
    this.display_name = user.display_name
    this.email = user.email
    this.username = user.username
    this._notifications = user._notifications || []
    this._contacts = user._contacts || []
    this.notificationsFetched = !!user.notificationsFetched
    this.contactsFetched = !!user.contactsFetched
  }

  get contacts () : Array<Contact>{
    return User.getContacts(this)
  }

  get notifications ()  : Array<Notification> {
    return User.getNotifications(this)
  }

  setContacts(contacts: Array<Contact>) {
    this._contacts = contacts
  }

  setNotifications(items: Array<Notification>) {
    this._notifications = items
  }

  addContact () {

  }

  addEntity () {

  }

  updateWith () {

  }
}
