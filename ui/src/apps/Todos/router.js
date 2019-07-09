
// @flow

import React from 'react'
import Router from 'middle-router'

import Todos from './'

const router = Router()
  .use('/', ({resolve}) => {
    resolve({view: Todos, app: 'todos'})
  })

export default router
