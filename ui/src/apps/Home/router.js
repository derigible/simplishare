
// @flow

import React from 'react'
import Router from 'middle-router'

import Home from './'

const router = Router()
  .use('/', ({resolve}) => {
    resolve({view: Home, app: 'home'})
  })

export default router
