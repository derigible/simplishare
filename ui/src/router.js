import React from 'react'
import Router from 'middle-router'

import NotFound from './errors/NotFound'

const configureRouter = () => {
  return Router({ hash: '#!' })
    .lazy(
      '/',
      () => {
        return new Promise(
          (resolve) => require.ensure(
            [],
            (require) => resolve(require('./review/router').default),
            'review'
          )
        )
      }
    )
    .lazy('/review', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./review/router').default), 'review'
    )))
    .lazy('/auth', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./auth/router').default), 'auth'
    )))
    .lazy('/admin', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./admin/router').default), 'admin'
    )))
    .use('/*', ({ path, resolve, exiting }) => {
      resolve({view: <NotFound />, app: 'notFound'})
    })
}

export default configureRouter

export const router = configureRouter()
