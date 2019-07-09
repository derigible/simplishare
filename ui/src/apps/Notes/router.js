
// @flow

import React from 'react'
import Router from 'middle-router'

import Notes from './'

const router = Router()
  .use('/', ({resolve}) => {
    resolve({view: Notes, app: 'notes'})
  })

export default router
