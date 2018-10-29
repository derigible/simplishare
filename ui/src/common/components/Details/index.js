import PropTypes from 'prop-types'
import React from 'react'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import parse from 'date-fns/parse'

import Typography from '@instructure/ui-elements/lib/components/Text'
import SelectionManager from '../SelectionManager'

import * as customPropTypes from '../../propTypes'
import View from '@instructure/ui-layout/lib/components/View'

function getDate(dateString) {
  return distanceInWordsToNow(parse(dateString), { includeSeconds: true, addSuffix: true })
}

export default function Details ({
  createdAt, updatedAt, possibleTags, tags, addTag, createAndAddTag, onSelectMenuOpenChange, showTags
}) {
  return (
    <View as="div" margin="small none none none">
      { showTags
        ? <SelectionManager
            possibleTags={possibleTags}
            onSelectTag={addTag}
            onTagDefine={createAndAddTag}
            onMenuOpenChange={onSelectMenuOpenChange}
            label="Tags"
            selectedTags={tags}
          />
        : null }
      {showTags ? <hr /> : null}
      <Typography size="small">
        Created &nbsp;
      </Typography>
      <Typography size="small" color="secondary">
        {getDate(createdAt)}
      </Typography>
      &nbsp;|&nbsp;
      <Typography size="small">
        Updated &nbsp;
      </Typography>
      <Typography size="small" color="secondary">
        {getDate(updatedAt)}
      </Typography>
    </View>
  )
}

Details.propTypes = {
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  possibleTags: customPropTypes.possibleTags,
  tags: PropTypes.arrayOf(PropTypes.number),
  addTag: PropTypes.func,
  createAndAddTag: PropTypes.func,
  onSelectMenuOpenChange: PropTypes.func,
  showTags: PropTypes.bool.isRequired
}

Details.defaultProps = {
  addTag: () => {},
  createAndAddTag: () => {},
  onSelectMenuOpenChange: () => {},
  tags: [],
  showTags: false
}
