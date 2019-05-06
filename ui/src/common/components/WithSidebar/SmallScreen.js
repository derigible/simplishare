import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import View from '@instructure/ui-layout/lib/View'
import Tray from '@instructure/ui-overlays/lib/Tray'
import Button from '@instructure/ui-buttons/lib/Button'
import IconExpandStart from '@instructure/ui-icons/lib/IconExpandStartLine'
import ScreenReaderContent from '@instructure/ui-a11y/lib/ScreenReaderContent'
import Flex from '@instructure/ui-layout/lib/Flex'
import FlexItem from '@instructure/ui-layout/lib/Flex/FlexItem'
import PresentationContent from '@instructure/ui-a11y/lib/PresentationContent'

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
          <FlexItem>
            <Button variant="icon" icon={IconExpandStart} onClick={this.toggleOpen} >
              <ScreenReaderContent>Click to open Content Controls</ScreenReaderContent>
            </Button>
          </FlexItem>
          <FlexItem margin="none none none xx-small">
            <PresentationContent>
              Open Content Controls
            </PresentationContent>
          </FlexItem>
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
