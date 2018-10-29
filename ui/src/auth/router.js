import React from 'react'
import Router from 'middle-router'

import Authenticate from './pages/Authenticate'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const authRouter = Router()
  .use('/', ({resolve}) => {
    resolve( <Authenticate />)
  })
  .use('/forgotPassword', ({resolve}) => {
    resolve(<ForgotPassword />)
  })
  .use('/resetPassword', ({resolve}) => {
    resolve(<ResetPassword />)
  })

export default authRouter
