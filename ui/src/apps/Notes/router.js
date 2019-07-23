
// @flow

import React from 'react'
import Router from 'middle-router'

import Notes from './'
import { Note } from '../../resources/Note/record'

const router = Router()
  .use('/', ({resolve}) => {
    resolve({view: Notes, app: 'notes', records: {note: Note}})
  })

export default router
