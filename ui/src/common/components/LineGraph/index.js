import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'

export default class LineGraph extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    /** Used to determine if the value contains the scope */
    containsScope: PropTypes.func,
    /**
     * The values of the field we are interested in creating buckets for.
     */
    scopes: PropTypes.arrayOf(PropTypes.string),
    /** The value the buckets are used to create a line */
    xValue: PropTypes.string,
    xValueTransform: PropTypes.func,
    yValue: PropTypes.string
  }

  static defaultProps = {
    data: [],
    xValue: 'date',
    yValue: 'amount',
    xValueTransform: (x) => x,
    containsScope: (x, scope) => true
  }

  groupBy = (value) => {
    return this.props.xValueTransform(value[this.props.xValue])
  }

  transformEvents () {
    const { scopes, xValue, yValue, data, containsScope } = this.props
    const dataByXValue = groupBy(data, this.groupBy)
    const dataPoints = []
    forEach(dataByXValue, (points, key) => {
      const scopedData = {}
      forEach(scopes, (scope) => {
        scopedData[scope] = 0
      })
      forEach(scopes, (scope) => {
        forEach(points, (point) => {
          // Only add to sum if scope value exists
          if (containsScope(point, scope)) {
            scopedData[scope] += point[yValue]
          }
        })
      })
      dataPoints.push({
        [xValue]: key,
        ...scopedData
      })
    })
    return dataPoints
  }

  renderLines () {
    const { scopes } = this.props
    return scopes.map((scope) => {
      return <Line key={scope} type="monotone" dataKey={scope} stroke="#8884d8" />
    })
  }

  render () {
    return (
      <LineChart
        width={600}
        height={300}
        data={this.transformEvents()}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}
      >
        <XAxis dataKey={this.props.xValue} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {this.renderLines()}
      </LineChart>
    )
  }
}
