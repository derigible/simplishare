// @flow

import * as React from 'react';

import { Navigation } from '@instructure/ui-navigation'
import { IconEmailLine } from '@instructure/ui-icons'
import { IconRubricLine } from '@instructure/ui-icons'
import { IconInboxLine } from '@instructure/ui-icons'
import { IconComposeLine } from '@instructure/ui-icons'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { Avatar } from '@instructure/ui-elements'
import { Badge } from '@instructure/ui-elements'

import type { UserType } from '../../resources/user/type'

export default function Page (
  {user, children, pageName} :
  {user: UserType, children: React.Node, pageName: string}
) {
  const [navOpen: boolean, setNavOpen] = React.useState(false)
  const marginLeft = navOpen ? '54px' : '84px'

  return (
    <div>
      <div style={{position: "fixed", top: "0", left: "0", height: "100%"}}>
        <Navigation
          label="Main navigation"
          toggleLabel={{
            expandedLabel: 'Minimize Navigation',
            minimizedLabel: 'Expand Navigation'
          }}
          minimized={navOpen}
          onMinimized={() => setNavOpen(!navOpen)}
        >
          <Navigation.Item
            icon={<IconEmailLine />}
            label={<ScreenReaderContent>Home</ScreenReaderContent>}
            href="#home"
            theme={{
              backgroundColor: 'red',
              hoverBackgroundColor: 'blue'
            }}
          />
          <Navigation.Item
            icon={<Avatar name={user.display_name} size="x-small"/>}
            label="Profile"
            href="#!user"
            selected={pageName == 'user'}
          />
          <Navigation.Item
            icon={<Badge count={user.action_items.length}><IconInboxLine /></Badge>}
            label="Inbox"
            href="#user/inbox"
            selected={pageName == 'user/inbox'}
          />
          <Navigation.Item
            icon={<IconRubricLine />}
            label="Todos"
            href="#todos"
            selected={pageName == 'todos'}
          />
          <Navigation.Item
            icon={<IconComposeLine />}
            label="Notes"
            href="#notes"
            selected={pageName == 'notes'}
          />
        </Navigation>
      </div>
      <div style={{display: "flex", flexDirection: "column", marginLeft }}>
        {children}
      </div>
    </div>
  )
}
