// @flow

import * as React from 'react'

import keycode from 'keycode'

export default function ClickableDiv ({children, onClick} : {children: React.Node, onClick: any}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => { if (keycode.isEventKey(e, 'enter')) onClick() } }
      style={{cursor: 'pointer'}}
    >
      {children}
    </div>
  )
}
