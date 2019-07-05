// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import theme from '@instructure/canvas-theme'

import Page from './components/Page'

theme.use()

const app = document.getElementById('app')

if (app !== null) {
  ReactDOM.render(
    <Page
      user={{display_name: 'Roger Rabbit', action_items: [{type: 'a'}]}}
      pageName="home"
    >
      <div>
        Hello World
      </div>
    </Page>,
    app
  )
}
