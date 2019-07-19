// @flow

import React from 'react'

import { View } from '@instructure/ui-layout'
import { ToggleGroup } from '@instructure/ui-toggle-details'
import { IconXSolid, IconPlusSolid } from '@instructure/ui-icons'

import StandardEdit from '../../components/StandardEdit'
import StandardActions from '../../components/StandardActions'

import type { Todo as TodoType } from './record'

export default function Todo ({todo} : {todo: TodoType}) {
  const [title, setTitle] = React.useState(todo.title)
  const [description, setDescription] = React.useState(todo.description)
  const [expanded, setExpanded] = React.useState(!!todo.expanded)

  return (
    <ToggleGroup
      toggleLabel="Toggle to edit details"
      summary={
        <StandardEdit
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onSave={() => todo.updateWith({title})}
        />
      }
      iconExpanded={IconXSolid}
      icon={IconPlusSolid}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <View
        as="div"
        padding="small"
      >
        <StandardEdit
          value={description}
          label="Description"
          onChange={(e) => setDescription((e.target.value))}
          onSave={() => todo.updateWith({description})}
        />
        <StandardActions
          entity={todo}
        />
      </View>
    </ToggleGroup>
  )
}
