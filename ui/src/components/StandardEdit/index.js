// @flow

import React from 'react'

import { InPlaceEdit } from '@instructure/ui-editable'
import { Text } from '@instructure/ui-elements'
import { View } from '@instructure/ui-layout'

// In the future we can extend this to do other types
type valueTypes = string;

function renderView (value: valueTypes) {
  return function RenderView () {
    return (
      <Text size="large">
        {value}
      </Text>
    )
  }
}

function renderEdit (label: string, value: valueTypes, onChange: any) {
  return function RenderEdit ({onBlur, editorRef}) {
    return (
      <Text
        size="large"
        as="input"
        type="text"
        value={value}
        onChange={onChange}
        aria-label={label}
        onBlur={onBlur}
        elementRef={editorRef}
      />
    )
  }
}

function renderEditButton (label: string){
  return function (props) {
    return InPlaceEdit.renderDefaultEditButton({...props, label: `Edit "${label}"`})
  }
}

export default function StandardEdit (
  {label, value, onChange} : {label: string, value: valueTypes, onChange: any}
) {
  const [mode, setMode] = React.useState(false)

  return (
    <>
      <View
        as="div"
        display="inline-block"
        margin="none small none none"
        padding="small"
        background="inverse"
      >
        {label}
      </View>
      <InPlaceEdit
        renderViewer={renderView(value)}
        renderEditor={renderEdit(label, value, onChange)}
        renderEditButton={renderEditButton(label)}

        onChangeMode={() => setMode(!mode)}
        mode={mode ? 'edit' : 'view'}

        value={value}
      />
    </>
  )
}
