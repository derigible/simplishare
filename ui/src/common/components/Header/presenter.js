import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Avatar from '@instructure/ui-elements/lib/components/Avatar'
import Button from '@instructure/ui-buttons/lib/components/Button'
import Flex, { FlexItem } from '@instructure/ui-layout/lib/components/Flex'
import Popover, { PopoverContent, PopoverTrigger } from '@instructure/ui-overlays/lib/components/Popover'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Text from '@instructure/ui-elements/lib/components/Text'
import Tray from '@instructure/ui-overlays/lib/components/Tray'
import View from '@instructure/ui-layout/lib/components/View'

import Hamburger from '@instructure/ui-icons/lib/Line/IconHamburger'
import IconMore from '@instructure/ui-icons/lib/Line/IconMore'
import themeable from '@instructure/ui-themeable/lib/themeable'

import NavigationLink from './NavigationLink'

import styles from './styles.css'
import theme from './theme'
import Link from '@instructure/ui-elements/lib/components/Link'

class Header extends Component {
  render () {
    // const { isOpen, closeSidebar, openSidebar, children } = this.props
    return (
      <nav className={styles.header}>
        <Flex>
          <FlexItem shrink grow padding="small 0 0 0">
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <NavigationLink
                  href="/"
                  windowPathname=""
                >
                  <span className={styles.logo}>P</span>
                </NavigationLink>
              </li>
              {/* <li className={styles.hamburgerIcon}>
                <Link onClick={isOpen ? closeSidebar : openSidebar} variant="icon">
                  <Hamburger />
                </Link>
              </li> */}
              <li className={styles.listItem}>
                <NavigationLink
                  href="/todos"
                  windowPathname={this.props.windowPathname}
                >
                  Todos
                </NavigationLink>
              </li>
              <li className={styles.listItem}>
                <NavigationLink
                  href="/notes"
                  windowPathname={this.props.windowPathname}
                >
                  Notes
                </NavigationLink>
              </li>
            </ul>
          </FlexItem>
          <FlexItem>
            <Popover
              on="click"
              offsetX={-24.5}
              withArrow={false}
            >
              <PopoverTrigger>
                <Avatar
                  name={this.props.username}
                  src={this.props.src}
                  size="small"
                  margin="0 medium 0 0"
                />
              </PopoverTrigger>
              <PopoverContent>
                <View padding="medium" display="block">
                  <Text>
                    Welcome {this.props.username}
                  </Text>
                  <ul>
                    <li>
                      <Link href="/admin">
                        Preferences
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/contacts">
                        Contacts
                      </Link>
                    </li>
                  </ul>
                  <Button
                    onClick={this.props.logout}
                  >
                    Log out
                  </Button>
                </View>
              </PopoverContent>
            </Popover>
          </FlexItem>
        </Flex>
        {/* <Tray
          label="Pertinent Information"
          closeButtonLabel="Close"
          open={isOpen}
          onDismiss={closeSidebar}
          size="small"
          applicationElement={() => document.getElementById('app') }
        >
          {children}
        </Tray> */}
      </nav>
    )
  }
}

Header.propTypes = {
  isOpen: PropTypes.bool,
  closeSidebar: PropTypes.func.isRequired,
  openSidebar: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  children: PropTypes.element,
  username: PropTypes.string,
  windowPathname: PropTypes.string.isRequired,
  src: PropTypes.string
}

Header.defaultProps = {
  children: <div />,
  isOpen: false,
  username: 'User'
}

export default themeable(theme, styles)(Header)
