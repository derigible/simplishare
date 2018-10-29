import React from 'react'
import PropTypes from 'prop-types'

import Select from '@instructure/ui-forms/lib/components/Select'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'

const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
]

function currentMonth () {
  return (new Date().getMonth() + 1).toString()
}

function currentYear () {
  return new Date().getFullYear().toString()
}

export default function Specify ({
  specified = null,
  onSpecification,
  period
}) {
  function handleSpecificationChange (_e, option) {
    onSpecification(option.value)
  }
  switch (period) {
    case 'month':
      return (
        <Select
          label={<ScreenReaderContent>Months</ScreenReaderContent>}
          value={specified || currentMonth()}
          onChange={handleSpecificationChange}
          layout="inline"
        >
          {monthNames.map((c, i) => <option key={c} value={(i + 1).toString()}>{c}</option>)}
        </Select>
      )
    case 'quarter':
      return (
        <Select
          label={<ScreenReaderContent>Quarters</ScreenReaderContent>}
          value={specified || (currentMonth() / 3).toString()}
          onChange={handleSpecificationChange}
          layout="inline"
        >
          {specified === null && <option>--</option>}
          {[1, 2, 3, 4].map((c) => <option key={c} value={c.toString()}>{c}</option>)}
        </Select>
      )
    case 'year':
      const year = currentYear()
      return (
        <Select
          label={<ScreenReaderContent>Years</ScreenReaderContent>}
          value={specified || year}
          onChange={handleSpecificationChange}
          layout="inline"
        >
          {[...Array(15).keys()].map((i) => <option key={i} value={(year - i).toString()}>{year - i}</option>)}
        </Select>
      )
    default:
      return null

  }
}

Specify.propTypes = {
  specified: PropTypes.string,
  onSpecification: PropTypes.func.isRequired,
  period: PropTypes.string.isRequired
}
