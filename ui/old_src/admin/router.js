import React from 'react'
import Router from 'middle-router'

import Admin from './pages/Admin'
import Contacts from './pages/Contacts'

const contactsRouter = Router()
  .use('/', ({resolve}) => {
    resolve(<Admin />)
  })
  .use('/contacts', ({resolve}) => {
    resolve(<Contacts />)
  })

export default contactsRouter
