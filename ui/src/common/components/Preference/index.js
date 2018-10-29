import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'

import Text from '@instructure/ui-elements/lib/components/Text'
import FormFieldGroup from '@instructure/ui-forms/lib/components/FormFieldGroup'
import Flex, { FlexItem } from '@instructure/ui-layout/lib/components/Flex'
import Heading from '@instructure/ui-elements/lib/components/Heading'
import RadioInputGroup from '@instructure/ui-forms/lib/components/RadioInputGroup'
import RadioInput from '@instructure/ui-forms/lib/components/RadioInput'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import View from '@instructure/ui-layout/lib/components/View'
import uc from '@instructure/ui-utils/lib/capitalizeFirstLetter'

export default class Preference extends Component {
  static propTypes = {
    binary: PropTypes.bool,
    preference: PropTypes.object.isRequired,
    updatePreference: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    showRecordType: PropTypes.bool.isRequired
  }

  setPreference = (action, record_type, preference_type, preference) => {
    return this.props.updatePreference({action, record_type, preference_type, preference})
  }

  renderAction (action, actionType, recordType) {
    const setting = action || 'not_set'
    return (
      <Flex key={actionType} justifyItems="space-between">
        <FlexItem margin="none small none none">{actionType}:</FlexItem>
        <FlexItem>
          <View background="default" as="div" shadow="resting">
            <RadioInputGroup
              size="medium"
              variant="toggle"
              defaultValue={setting}
              description={
                <ScreenReaderContent>Set {actionType} Preference for {recordType}</ScreenReaderContent>
              }
              onChange={(e, val) => this.setPreference(actionType, recordType, this.props.label, val)}
              name={`${actionType}${recordType}${this.props.label}`}
            >
              <RadioInput label="Always" value="always" context="success" />
              {!this.props.binary ? <RadioInput label="Not Set" value="not_set" context="off"/> : null }
              <RadioInput label="Never" value="never" context="danger" />
            </RadioInputGroup>
          </View>
        </FlexItem>
      </Flex>
    )
  }

  renderRecordType (record, recordType) {
    const { showRecordType, label } = this.props
    return (
      <View
        as="div"
        borderWidth="small 0 small 0"
        key={recordType}
      >
        <Flex
          key={recordType}
          direction="row"
          justifyItems="space-between"
          margin="small"
        >
          <FlexItem>
            <Text>{showRecordType ? uc(recordType) : label}</Text>
          </FlexItem>
          <FlexItem>
            <FormFieldGroup
              layout="stacked"
              description={<ScreenReaderContent>Toggle Settings</ScreenReaderContent>}
              rowSpacing="small"
            >
              {
                Object.keys(record).map((actionType) => this.renderAction(record[actionType], actionType, recordType))
              }
            </FormFieldGroup>
          </FlexItem>
        </Flex>
      </View>
    )
  }

  render () {
    const { preference, label, showRecordType } = this.props
    return (
      <Fragment>
        {showRecordType
          ? <Heading level="h2" margin="small 0 0 0">{uc(label)} Settings</Heading>
          : null
        }
        {
          Object.keys(preference).map((recordType) => this.renderRecordType(preference[recordType], recordType))
        }
      </Fragment>
    )
  }
}
