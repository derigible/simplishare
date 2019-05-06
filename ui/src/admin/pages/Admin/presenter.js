import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Heading from '@instructure/ui-elements/lib/Heading'
import View from '@instructure/ui-layout/lib/View'

import Preferences from '../../../common/components/Preferences'
import Chrome from '../../../common/components/Chrome'

export default class Admin extends Component {
  static propTypes = {
    preferences: PropTypes.object.isRequired,
    retrievePreferences: PropTypes.func.isRequired,
    updateUserPreference: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.retrievePreferences()
  }

  render () {
    const { preferences, updateUserPreference } = this.props
    return (
      <Chrome>
        <View  as="div" maxWidth="800px" margin="auto">
          <Heading level="h1" border="bottom">Preferences</Heading>
          <Preferences preferences={preferences} updatePreference={updateUserPreference} binary />
        </View>
      </Chrome>
    )
  }
}
