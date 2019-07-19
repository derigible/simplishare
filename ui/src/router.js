// @flow

import React from 'react'
import Router from 'middle-router'

import NotFound from './apps/NotFound'

declare var require: {
	(id: string): any;
	ensure(ids: Array<string>, callback?: { (require: typeof require): void }, chunk?: string): void
}

const configureRouter = () => {
  return Router({ hash: '#!' })
    .lazy('/', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./apps/Home/router').default), 'home'
    )))
    .lazy('/home', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./apps/Home/router').default), 'home'
    )))
    .lazy('/todos', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./apps/Todos/router').default), 'todos'
    )))
    .lazy('/notes', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./apps/Notes/router').default), 'notes'
    )))
    .lazy('/user', () => new Promise((resolve) => require.ensure(
      [], (require) => resolve(require('./apps/Profile/router').default), 'user'
    )))
    .use('/*', ({ path, resolve, exiting }) => {
      resolve({view: NotFound, app: 'notFound'})
    })
}

export default configureRouter

export const router = configureRouter()
