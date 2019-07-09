// @flow

import React from 'react'

import { View } from '@instructure/ui-layout'
import { ToggleGroup } from '@instructure/ui-toggle-details'
import { IconXSolid, IconPlusSolid } from '@instructure/ui-icons'

import type { Notification as NotificationType } from '../type'

export default function Notification ({notification} : {notification: NotificationType}) {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <ToggleGroup
      toggleLabel="Toggle to edit details"
      summary={notification.type}
      iconExpanded={IconXSolid}
      icon={IconPlusSolid}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <View
        as="div"
        padding="small"
      >
        {notification.type}
      </View>
    </ToggleGroup>
  )
}
