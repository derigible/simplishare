// @flow

export type Notification = {
  type: string
}

export type UserType = {
  display_name: string,
  action_items: Array<Notification>
}
