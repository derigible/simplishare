import React from 'react'
import Router from 'middle-router'

import NotesList from './pages/NotesList'
import Note from './pages/Note'
import ToDos from './pages/ToDos'
import Page from './pages/Page'

const todos = (
  <Page pageName="Todos">
    <ToDos />
  </Page>
)

const note = (id, isEdit) => (
  <Page>
    <Note id={id} isEdit={isEdit} />
  </Page>
)

const reviewRouter = Router()
  .use('/', ({resolve}) => {
    resolve(todos)
  })
  .use('/todos/view/:id', ({resolve}) => {
    resolve(todos)
  })
  .use('/todos', ({resolve}) => {
    resolve(todos)
  })
  .use('/notes/view/:id', ({resolve, params}) => {
    resolve(note(params.id))
  })
  .use('/notes/edit/:id', ({resolve, params}) => {
    resolve(note(params.id, true))
  })
  .use('/notes', ({resolve}) => {
    resolve(
      <Page
        pageName="Notes"
      >
        <NotesList />
      </Page>
    )
  })
  // .use('/categories', ({path, resolve, exiting, params, location}) => {
  //   resolve({
  //     app,
  //     view: <Categories />
  //   })
  // })

export default reviewRouter
