import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { getAngle, getCirclePosX, getCirclePosY } from './DefaultFunctions'

import style from './Timeline.module.css'

const SVG_OFFSET = 20

class Timeline extends React.Component {
  state = {
    desiredValue: 0,
    seeking: false
  }

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
      const centerX = Math.floor(window.innerWidth * 0.5)
      const centerY = Math.floor(window.innerHeight * 0.5)
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
    const centerX = Math.floor(window.innerWidth * 0.5)
    const centerY = Math.floor(window.innerHeight * 0.5)
    const angle = getAngle(e.clientX, e.clientY, centerX, centerY)
    const progress = angle / 360

    this.props.seekTo(progress)
  }

  render () {
    const { round, color, played, r, duration, playedSeconds } = this.props
    const { desiredValue, seeking } = this.state

    const currentPlayed = (seeking) ? desiredValue : played

    const circumference = Math.PI * (r - 2) * 2
    const progress = circumference * currentPlayed
    const dashOffset = circumference - progress

    const angle = currentPlayed * 360

    return [
      <div key='standard' className={style.controls}>
        {round &&
          [
            <div
              key='svgClickArea'
              className={style.timelineClickArea}
              onClick={this.onTimelineSelect}
              onMouseDown={this.onScrubStart}
              onMouseMove={this.onScrub}
              onMouseUp={this.onScrubEnd}
            />,
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
          ]
        }
        {round && duration &&
        <div className={style.time}>
          <p>{moment.utc(playedSeconds * 1000).format('mm:ss')} / {moment.utc(duration * 1000).format('mm:ss')}</p>
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
