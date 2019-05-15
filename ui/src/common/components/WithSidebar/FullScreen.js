import PropTypes from 'prop-types'
import React from 'react'
import {View,Grid} from '@instructure/ui-layout'


export default function FullScreen ({children, content, sidebarWidth = '22.5rem', contentOffset = '23rem'}) {
  return (
    <View as="div" margin="none small none none">
      <Grid>
        <Grid.Row colSpacing="small">
          <Grid.Col width="auto">
            <View
              as="div"
              width={sidebarWidth}
              minHeight="10rem"
              padding="none x-small"
              shadow="resting"
            >
              <View
                as="div"
              >
                {content}
              </View>
            </View>
          </Grid.Col>
          <Grid.Col>
            {children}
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </View>
  )
}

FullScreen.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  content: PropTypes.element.isRequired,
  contentOffset: PropTypes.string,
  sidebarWidth: PropTypes.string
}
