import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'

class Axes extends React.Component {
  componentDidMount () {
    const svg = d3.select(this.svg)
    this.lines = svg.append('g')
    this.sublines = svg.append('g')
    this.rebuild()
  }

  componentDidUpdate () {
    this.rebuild()
  }

  rebuild = () => {
    const { dimensions } = this.props

    const lines = this.lines
      .selectAll('line')
      .data([0, 45, 90, 135, 180])

    lines.enter()
      .append('line')
      .merge(lines)
      .attr('x1', dimensions.width)
      .attr('y1', -5000)
      .attr('x2', dimensions.width)
      .attr('y2', 5000)
      // .style('stroke', 'url(#lgrad)')
      .style('stroke', '#85d7ea')
      .style('stroke-width', 1)
      .style('transform', d => `rotate(${d}deg)`)
      .style('transform-origin', `${dimensions.width}px ${dimensions.height}px`)

    const sublines = this.sublines
      .selectAll('line')
      .data(Array(72).fill(0).map((d, i) => i * (360 / 72)))
    sublines.enter()
      .append('line')
      .merge(sublines)
      .attr('x1', dimensions.width)
      .attr('y1', dimensions.height - (dimensions.maxDimension * 0.2))
      .attr('x2', dimensions.width)
      .attr('y2', dimensions.height - (dimensions.maxDimension * 0.35))
      // .attr('stroke', 'url(#lgrad)')
      .style('stroke', '#85d7ea')
      .style('stroke-width', 1)
      .style('transform', d => `rotate(${d}deg)`)
      .style('transform-origin', `${dimensions.width}px ${dimensions.height}px`)
  }

  render () {
    const { dimensions, globals, transform } = this.props
    return (
      <svg
        style={{
          position: 'absolute',
          zIndex: -1,
          top: `-${Math.floor(dimensions.centerY)}px`,
          left: `-${Math.floor(dimensions.centerX)}px`,
          // fill: '#979ca6',
          pointerEvents: 'none',
          visibility: (globals.addNodeRoutineRunning && !globals.nodeGetsPositioned) ? 'hidden' : 'visible',
          transform
        }}
        width={dimensions.width * 2}
        height={dimensions.height * 2}
        ref={(ref) => { this.svg = ref }}
      >
        {/* <defs>
          <linearGradient id='lgrad' x1='50%' y1='100%' x2='50%' y2='0%' gradientUnits='userSpaceOnUse'>
            <stop offset='0%' style={{ stopColor: 'rgb(246,79,89)', stopOpacity: '1' }} />
            <stop offset='50%' style={{ stopColor: 'rgb(196,113,237)', stopOpacity: '1' }} />
            <stop offset='100%' style={{ stopColor: 'rgb(18,194,233)', stopOpacity: '1' }} />
          </linearGradient>
        </defs> */}
      </svg>
    )
  }
}

function mapStateToProps (state) {
  const { globals, dimensions } = state
  return { globals, dimensions }
}

export default connect(mapStateToProps)(Axes)
