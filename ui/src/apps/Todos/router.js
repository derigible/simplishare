
// @flow

import React from 'react'
import Router from 'middle-router'

import Todos from './'
import { Todo } from '../../resources/Todo/record'

const router = Router()
  .use('/', ({resolve}) => {
    resolve({view: Todos, app: 'todos', records: {todo: Todo}})
  })

export default router
