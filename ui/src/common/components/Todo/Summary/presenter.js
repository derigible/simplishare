import PropTypes from 'prop-types'
import React from 'react'

import {Tooltip} from '@instructure/ui-overlays'
import { Text as Typography} from '@instructure/ui-elements'
import {IconTextStartLine as IconTextStart} from '@instructure/ui-icons'
import {Link} from '@instructure/ui-elements'

import { todoProps, deletedTodosProps } from "../../../propTypes"

export default function Summary ({entity, hideCompleted, deletedTodos}) {

  // function hasSubTodos () {
  //   const filtered = entity.todos.filter((t) => !deletedTodos.has(t.id))
  //   if (hideCompleted) {
  //     return filtered.filter((t) => t.archived !== true )
  //   }
  //   return filtered.length > 0
  // }
  // function hasDetails () {
  //   return (entity.description && entity.description.length > 0)
  //     || hasSubTodos().length > 0
  // }

  return (
    <span>
      <Typography>{entity.archived ? <s>{entity.title}</s> : entity.title}</Typography>
      {/* {hasDetails()
        ? <Tooltip tip="Contains additional details">
            <Link margin="0 0 0 small" as="a"><IconTextStart /></Link>
          </Tooltip>
        : null
      } */}
    </span>
  )
}

Summary.propTypes = {
  entity: todoProps.isRequired,
  hideCompleted: PropTypes.bool.isRequired,
  deletedTodos: deletedTodosProps
}
