// @flow

import React from 'react'

import { List } from '@instructure/ui-elements'
import { Button } from '@instructure/ui-buttons'
import { IconPlusLine } from '@instructure/ui-icons'
import { TextInput } from '@instructure/ui-text-input'

import Page from '../../components/Page'
import StandardEditModal from '../../components/StandardEditModal'
import Todo from '../../resources/Todo'

import type { UserType } from '../../resources/User/type'
import type { Todo as TodoType } from '../../resources/Todo/type'
import type { ComponentActionType } from '../../constants/actionTypes'
import { defaultTodo } from '../../resources/Todo/type'

function reducer(state: TodoType, action: ComponentActionType) {
  switch (action.type) {
    case 'description':
      return {...state, description: action.payload};
    case 'title':
      return {...state, title: action.payload}
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
        <TextInput renderLabel="Description" value={todoObj.description} onChange={(_, value) => setTodoChanges({type: 'description', payload: value})} />
      </StandardEditModal>
      <List variant="unstyled">
        {todos.map(t => <List.Item key={t.id}><Todo todo={t} /></List.Item>)}
      </List>
    </Page>
  )
}
