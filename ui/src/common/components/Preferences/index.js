import React from 'react'
import Preference from '../Preference'

export default function Preferences ({preferences, updatePreference, showRecordType = true, binary = false}) {
  return Object.keys(preferences).map((p) => {
    const preference = preferences[p]
    return (
      <Preference
        key={p}
        label={p}
        preference={preference}
        updatePreference={updatePreference}
        showRecordType={showRecordType}
        binary={binary}
      />
    )
  })
}
