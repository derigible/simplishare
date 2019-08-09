// @flow

import axios from 'axios'

import { axiosError } from '../../errors'
import { BaseRecord, retrieve } from '../baseRecords'

import type { VirtualEntity } from '../baseRecords'

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

type NotificationData = {
  type?: string,
  details: string
}

export class Notification {
  data: NotificationData
  id: string
  read: boolean
  created_at: string
  updated_at: string

  constructor(notification: Notification) {
    this.data = notification.data
    this.id = notification.id
    this.read = notification.read
    this.created_at = notification.created_at
    this.updated_at = notification.updated_at
  }
}

type UserParamsType = {
  display_name: string,
  email: string,
  username: string,
  _notifications?: Array<Notification>,
  _contacts?: Array<Contact>,
  notificationsFetchedStatus?: string,
  contactsFetched?: string
}

export class User extends BaseRecord {
  static async info (userId: ?string) {
    const url = userId ? `/users/${userId}` : '/users/info'
    try {
      const response = await axios.get(url)
      return new User(response.data)
    } catch (error) {
      axiosError(error)
    }
  }

  static getContacts (
    {user, userId, rerender} : { user: User, userId?: string, rerender: any}
  ) : Array<Contact> {
    const url = userId ? `/contacts?user_id=${userId}` : '/contacts'
    const setStatus = (s) => user.contactsFetched = s // eslint-disable-line no-param-reassign
    const success = (response) => {
      user.setContacts(
        response.data.map(c => new Contact(c))
      )
      rerender()
    }
    return retrieve(url, user.contactsFetched, setStatus, success, user._contacts)
  }

  static getNotifications (
    {user, userId, rerender} : { user: User, userId?: string, rerender: any}
  ) : Array<Notification> {
    const url = userId ? `/notifications?user_id=${userId}` : '/notifications'
    const setStatus = (s) => user.notificationsFetchedStatus = s // eslint-disable-line no-param-reassign
    const success = (response) => {
      user.setNotifications(
        response.data.map(n => new Notification(n))
      )
      rerender()
    }
    return retrieve(url, user.notificationsFetchedStatus, setStatus, success, user._notifications)
  }

  display_name: string
  email: string
  username: string
  _notifications: Array<Notification>
  notificationsFetchedStatus: string
  contactsFetched: string
  _contacts: Array<Contact>

  constructor(user: UserParamsType) {
    super()
    this.display_name = user.display_name
    this.email = user.email
    this.username = user.username
    this._notifications = user._notifications || []
    this._contacts = user._contacts || []
    this.notificationsFetchedStatus = user.notificationsFetchedStatus || 'pending'
    this.contactsFetched = user.contactsFetched || 'pending'
  }

  contacts (rerender: any) : Array<Contact>{
    return User.getContacts({user: this, rerender})
  }

  get notifications () : Array<Notification> {
    return User.getNotifications({user: this, rerender: User.prototype.callRender})
  }

  setContacts (contacts: Array<Contact>) {
    this._contacts = contacts
    this.contactsFetched = 'success'
  }

  setNotifications (items: Array<Notification>) {
    this._notifications = items
    this.notificationsFetchedStatus = 'success'
  }

  addContact = (email: string, rerender: any) => {
    return axios.post('/contacts', {contact: {email}})
      .then(response => {
        this.setContacts(this._contacts.concat([new Contact(response.data)]))
        rerender()
      })
      .catch((error) => axiosError(error))
  }

  addEntity (type: string, ve: VirtualEntity) {

  }

  async updateWith (user: User) {
    // TODO: update
    await axios.put('/users')
  }
}
