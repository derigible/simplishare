
// @flow

import React from 'react'
import Router from 'middle-router'

import Profile from './'

const router = Router()
  .use('/', ({resolve}) => {
    resolve({view: Profile, app: 'user'})
  })

export default router
