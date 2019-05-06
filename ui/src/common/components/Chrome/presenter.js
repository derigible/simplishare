import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Avatar from '@instructure/ui-elements/lib/Avatar'
import Button from '@instructure/ui-buttons/lib/Button'
import Link from '@instructure/ui-elements/lib/Link'
import Tray from '@instructure/ui-overlays/lib/Tray'
import View from '@instructure/ui-layout/lib/View'
import Flex from '@instructure/ui-layout/lib/Flex';
import FlexItem from '@instructure/ui-layout/lib/Flex/FlexItem';
import Heading from '@instructure/ui-elements/lib/Heading';

import IconCheckPlus from '@instructure/ui-icons/lib/IconCheckPlusSolid'
import IconCompose from '@instructure/ui-icons/lib/IconComposeSolid'

export default class Chrome extends PureComponent {
  navigateToTodos = () => {
    this.props.navigateTo('todos')
    this.props.closeSidebar()
  }

  navigateToNotes = () => {
    this.props.navigateTo('notes')
    this.props.closeSidebar()
  }

  render() {
    const { isOpen, closeSidebar, openSidebar, children } = this.props

    return (
      <View as='div'>
        <View as='div' borderWidth="0 0 medium 0">
          <Button
            variant="link"
            size="small"
            margin="0 small 0 0"
            onClick={openSidebar}
          >
            <Avatar
              name={this.props.username}
              src={this.props.src}
              size="small"
              margin="xx-small medium"
            />
          </Button>
          <span style={{color: 'pink', fontSize: "1.6rem", verticalAlign: "middle"}}>PinkAirship</span>
        </View>
        <View>
          {children}
        </View>
        <Tray
          label="Pertinent Information"
          open={isOpen}
          onDismiss={closeSidebar}
          size="small">
          <View as="div" margin="xx-small small">
            <Heading level="h2" margin="x-small xxx-small">Navigation</Heading>
            <Button fluidWidth icon={IconCheckPlus} onClick={this.navigateToTodos}>
              Todos
            </Button>
            <Button fluidWidth icon={IconCompose} onClick={this.navigateToNotes}>
              Notes
            </Button>
          </View>
          <View as="div" margin="xx-small small">
            <Heading level="h2" margin="x-small xxx-small">Account</Heading>
            <Flex direction="column">
              <FlexItem>
                <Link href="#!admin">
                  Preferences
                </Link>
              </FlexItem>
              <FlexItem>
                <Link href="#!admin/contacts">
                  Contacts
                </Link>
              </FlexItem>
            </Flex>
          </View>
        </Tray>
      </View>
    );
  }
}

Chrome.propTypes = {
  isOpen: PropTypes.bool,
  closeSidebar: PropTypes.func.isRequired,
  openSidebar: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  username: PropTypes.string,
  windowPathname: PropTypes.string.isRequired,
  src: PropTypes.string,
  navigateTo: PropTypes.func.isRequired
}
