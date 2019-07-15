// @flow

import axios from 'axios'

import { axiosError } from '../../errors'

import type { UserType, Notification } from './type'

export default class User {
  static async info (userId: ?string) {
    const url = userId ? `/users/${userId}` : '/users/info'
    try {
      const response = await axios.get(url)
      return new User({user: response.body})
    } catch (error) {
      axiosError(error)
    }
  }

  user: UserType;
  action_items: Array<Notification>

  constructor({user} : {user: UserType}) {
    this.user = user
    this.action_items = []
  }

  addContact () {

  }

  addEntity () {

  }
}
