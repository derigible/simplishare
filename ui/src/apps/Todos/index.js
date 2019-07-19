// @flow

import React from 'react'

import { List } from '@instructure/ui-elements'
import { Button } from '@instructure/ui-buttons'
import { IconPlusLine } from '@instructure/ui-icons'
import { TextArea } from '@instructure/ui-forms'
import { TextInput } from '@instructure/ui-text-input'

import Page from '../../components/Page'
import StandardEditModal from '../../components/StandardEditModal'
import Todo from '../../resources/Todo'
import { Todo as TodoRecord } from '../../resources/Todo/record'

import type { User as UserType } from '../../resources/User/record'
import type { Todo as TodoType } from '../../resources/Todo/record'
import type { ComponentActionType } from '../../constants/actionTypes'
import { defaultTodo, recordParams } from '../../resources/Todo/record'

function reducer(state: TodoType, action: ComponentActionType) {
  switch (action.type) {
    case 'description':
      return new TodoRecord(recordParams(state, {description: action.payload}))
    case 'title':
      return new TodoRecord(recordParams(state, {description: action.payload}))
    default:
      throw new Error();
  }
}

export default function Todos (
  {user, todos} : {user: UserType, todos: Array<TodoType>}
) {
  const [modalOpen: boolean, setModalOpen] = React.useState(false)
  const [todoObj: TodoType, setTodoChanges] = React.useReducer(reducer, defaultTodo)

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
    <Page
      user={user}
      pageName="todos"
    >
      <Button variant="primary" icon={IconPlusLine}  margin="small" onClick={toggleModal}>
        Add Todo
      </Button>
      <StandardEditModal
        onSave={
          () => {
            user.addEntity('todo', todoObj)
            toggleModal()
          }
        }
        closeModal={toggleModal}
        modalOpen={modalOpen}
        modalTitle="Add Todo"
      >
        <TextInput renderLabel="Title" value={todoObj.title} onChange={(_, value) => setTodoChanges({type: 'title', payload: value})} />
        <TextArea
          label="Description"
          value={todoObj.description}
          onChange={(_, value) => setTodoChanges({type: 'description', payload: value})}
          autogrow
          resize="both"
        />
      </StandardEditModal>
      <List variant="unstyled">
        {todos.map(t => <List.Item key={t.id}  margin="x-small none"><Todo todo={t} /></List.Item>)}
      </List>
    </Page>
  )
}
