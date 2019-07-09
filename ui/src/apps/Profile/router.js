
// @flow

import React from 'react'
import Router from 'middle-router'

import Profile from './'
import Inbox from './Inbox'

const router = Router()
  .use('/', ({resolve}) => {
    resolve({view: Profile, app: 'user'})
  })
  .use('/inbox', ({resolve}) => {
    resolve({view: Inbox, app: 'user/inbox'})
  })

export default router
