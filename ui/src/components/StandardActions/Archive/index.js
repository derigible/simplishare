// @flow

import React from 'react'

import { Button } from '@instructure/ui-buttons'
import { IconCollapseLine } from '@instructure/ui-icons'
import { Tooltip } from '@instructure/ui-overlays'
import { ScreenReaderContent } from '@instructure/ui-a11y'

import type { VirtualEntity } from '../../../resources/sharedTypes'

export default function Archive(
  {entity} : {entity: VirtualEntity}
) {
  return (
    <Tooltip
      tip={`Archive ${entity.displayName}`}
      placement="top"
    >
      <Button
        variant="icon"
        icon={IconCollapseLine}
        onClick={() => entity.archive()}
      >
        <ScreenReaderContent>Archive</ScreenReaderContent>
      </Button>
    </Tooltip>
  )
}
