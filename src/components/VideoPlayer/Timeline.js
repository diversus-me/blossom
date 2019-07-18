import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { getAngle, getCirclePosX, getCirclePosY } from '../Flower/DefaultFunctions'

import style from './Timeline.module.css'

const SVG_OFFSET = 20

class Timeline extends React.Component {
  state = {
    desiredValue: 0,
    seeking: false
  }

  currentScrub = 0

  // rangeChange = (e) => {
  //   this.setState({
  //     desiredValue: e.target.value
  //   })
  // }

  // onMouseUp = (e) => {
  //   this.props.seekTo(e.target.value)
  //   this.setState({
  //     seeking: false
  //   })
  // }

  onScrubStart = (e) => {
    this.setState({
      seeking: true
    })
  }

  onScrub = e => {
    if (this.state.seeking) {
      const { r } = this.props
      const boundingBox = this.container.getBoundingClientRect()
      const centerX = boundingBox.left + r
      const centerY = boundingBox.top + r
      const angle = getAngle(e.clientX, e.clientY, centerX, centerY)
      const progress = angle / 360

      this.currentScrub = progress

      this.setState({
        desiredValue: progress
      })
    }
  }

  onScrubEnd = e => {
    this.props.seekTo(this.currentScrub)
    this.setState({
      seeking: false
    })
  }

  onTimelineSelect = e => {
    const { r } = this.props
    const boundingBox = this.container.getBoundingClientRect()
    const centerX = boundingBox.left + r
    const centerY = boundingBox.top + r
    const angle = getAngle(e.clientX, e.clientY, centerX, centerY)
    const progress = angle / 360

    this.props.seekTo(progress)
  }

  render () {
    const { round, color, played, r, playedSeconds, simple } = this.props
    const { desiredValue, seeking } = this.state

    const currentPlayed = (played) ? (seeking) ? desiredValue : played : 0

    const circumference = Math.PI * (r - 2) * 2
    const progress = circumference * currentPlayed
    const dashOffset = circumference - progress

    const angle = currentPlayed * 360

    return [
      <div
        key='standard'
        className={style.controls}
        ref={(ref) => { this.container = ref }}
      >
        {round &&
        <svg
          key='svg'
          className={style.roundSVG}
          style={{ transform: `translate(-${SVG_OFFSET}px, -${SVG_OFFSET}px)` }}
        >
          <g
            ref={(ref) => { this.timelineTouchArea = ref }}
            className={style.timelineTouchArea}
            style={{ transform: `translate(${SVG_OFFSET}px, ${SVG_OFFSET}px)` }}
          >
            <circle
              className={style.timeline}
              style={{
                stroke: color,
                strokeDashoffset: dashOffset,
                strokeDasharray: circumference
              }}
              r={Math.max(0, r - 2)}
              cx={r - 1}
              cy={r - 1}
              ref={(ref) => { this.timeline = ref }}
              transform={`rotate(-90 ${r - 1} ${r - 1})`}
            />
            <circle
              fill={color}
              r={10}
              cx={getCirclePosX(r, angle, r) - 1}
              cy={getCirclePosY(r, angle, r) - 1}
            />
          </g>
        </svg>
        }
        <div
          className={style.timelineClickArea}
          onClick={this.onTimelineSelect}
          onMouseDown={this.onScrubStart}
          onMouseMove={this.onScrub}
          onMouseUp={this.onScrubEnd}
          style={{
            transform: (seeking) ? 'translate3d(0, 0, 0) scale(10)' : 'translate3d(0, 0, 0)',
            zIndex: (seeking) ? 100 : ''
          }}
        />
        {round && !!angle && !simple &&
        <div
          className={style.time}
          style={{
            transform: `translate(${getCirclePosX(r, angle, r) - 1}px, ${getCirclePosY(r, angle, r) - 1}px)`
          }}
          onMouseDown={this.onScrubStart}
          onMouseMove={this.onScrub}
          onMouseUp={this.onScrubEnd}
        >
          <div style={{
            transform: 'translate(-50%, -50%)',
            background: color,
            borderRadius: '20px',
            padding: '5px'
          }}>
            {moment.utc(playedSeconds * 1000).format('mm:ss')}
          </div>
        </div>
        }
      </div>
      // <div key='fullscreen' className={style.fullscreen}>
      //   {!round &&
      //   <input
      //     type='range'
      //     name='timeline'
      //     min='0' max='1'
      //     step='any'
      //     className={style.rangeInput}
      //     style={inputStyle}
      //     onChange={this.rangeChange}
      //     onMouseUp={this.onMouseUp}
      //     onMouseDown={this.onScrubStart}
      //     value={(seeking) ? desiredValue : played}
      //   />
      //   }
      // </div>
    ]
  }
}

Timeline.defaultProps = {
  round: false
}

Timeline.propTypes = {
  round: PropTypes.bool,
  width: PropTypes.number,
  radius: PropTypes.number,
  color: PropTypes.string.isRequired,
  played: PropTypes.number.isRequired,
  loaded: PropTypes.number.isRequired,
  seekTo: PropTypes.func.isRequired
}

export default Timeline
