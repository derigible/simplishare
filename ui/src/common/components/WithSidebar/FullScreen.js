import PropTypes from 'prop-types'
import React from 'react'
import View from '@instructure/ui-layout/lib/components/View'
import Grid, { GridCol, GridRow } from '@instructure/ui-layout/lib/components/Grid'

export default function FullScreen ({children, content, sidebarWidth = '22.5rem', contentOffset = '23rem'}) {
  return (
    <View as="div" margin="none small none none">
      <Grid>
        <GridRow colSpacing="small">
          <GridCol width="auto">
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
          </GridCol>
          <GridCol>
            {children}
          </GridCol>
        </GridRow>
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
