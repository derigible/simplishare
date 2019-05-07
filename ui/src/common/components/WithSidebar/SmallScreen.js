import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {Flex, View} from '@instructure/ui-layout'
import {Tray} from '@instructure/ui-overlays'
import {Button} from '@instructure/ui-buttons'
import {IconExpandStartLine as IconExpandStart} from '@instructure/ui-icons'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import {PresentationContent} from '@instructure/ui-a11y'

export default class SmallScreen extends PureComponent {
  state = {
    open: false
  }

  toggleOpen = () => {this.setState({open: !this.state.open})}

  render () {
    const {content, children} = this.props
    const {open} = this.state
    return (
      <View as="div" margin="none x-small">
        <Flex>
          <Flex.Item>
            <Button variant="icon" icon={IconExpandStart} onClick={this.toggleOpen} >
              <ScreenReaderContent>Click to open Content Controls</ScreenReaderContent>
            </Button>
          </Flex.Item>
          <Flex.Item margin="none none none xx-small">
            <PresentationContent>
              Open Content Controls
            </PresentationContent>
          </Flex.Item>
        </Flex>
        <Tray
          label="Content Controls"
          onDismiss={this.toggleOpen}
          open={open}
          size="large">
          <View
            as="div"
            padding="x-large small"
          >
            {content}
          </View>
        </Tray>
        {children}
      </View>
    );
  }
}

SmallScreen.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  content: PropTypes.element.isRequired
}
