import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md'

import { getAngle, getCirclePosX, getCirclePosY } from '../Flower/DefaultFunctions'

import style from './Timeline.module.css'

const SVG_OFFSET = 20

class Timeline extends React.Component {
  state = {
    desiredValue: 0,
    seeking: false,
    leftHandlePosition: 0,
    rightHandlePosition: 1,
    seekingLeft: false,
    seekingRight: false
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

  onScrubStart = (type) => {
    switch (type) {
      case 'left':
        this.setState({
          seekingLeft: true
        })
        break
      case 'right':
        this.setState({
          seekingRight: true
        })
        break
      case 'center':
        this.setState({
          seeking: true
        })
        break
      default:
        break
    }
  }

  onScrub = e => {
    const { seeking, seekingLeft, seekingRight } = this.state
    if (seeking || seekingLeft || seekingRight) {
      const { r } = this.props
      const boundingBox = this.container.getBoundingClientRect()
      const centerX = boundingBox.left + r
      const centerY = boundingBox.top + r
      const angle = getAngle(e.clientX, e.clientY, centerX, centerY)
      const progress = angle / 360

      const { showHandles } = this.props
      const { leftHandlePosition, rightHandlePosition } = this.state

      if (seeking) {
        let desiredValue = progress
        if (showHandles && progress < leftHandlePosition) {
          desiredValue = leftHandlePosition
        } else if (showHandles && progress > rightHandlePosition) {
          desiredValue = rightHandlePosition
        }

        this.currentScrub = desiredValue
        this.setState({
          desiredValue
        })
      }

      if (seekingLeft) {
        let newLeftHandlePosition = (progress > rightHandlePosition) ? rightHandlePosition : progress
        this.setState({
          leftHandlePosition: newLeftHandlePosition
        })
      }

      if (seekingRight) {
        let newRightHandlePosition = (progress < leftHandlePosition) ? leftHandlePosition : progress

        this.setState({
          rightHandlePosition: newRightHandlePosition
        })
      }
    }
  }

  onScrubEnd = e => {
    if (this.state.seeking) {
      this.props.seekTo(this.currentScrub)
    }
    this.setState({
      seeking: false,
      seekingLeft: false,
      seekingRight: false
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

  componentDidUpdate () {
    const { showHandles, playing } = this.props
    if (showHandles && playing) {
      const { played, togglePlay } = this.props
      const { leftHandlePosition, rightHandlePosition } = this.state

      if (played > rightHandlePosition) {
        togglePlay()
      } else if (played < leftHandlePosition) {
        togglePlay()
      }
    }
  }

  render () {
    const { round, color, played, r, playedSeconds, simple, showHandles, togglePlay } = this.props
    const { desiredValue, seeking, seekingLeft, seekingRight, leftHandlePosition, rightHandlePosition } = this.state

    const currentPlayed = (played) ? (seeking) ? desiredValue : played : 0

    const circumference = Math.PI * (r - 2) * 2
    const progress = circumference * currentPlayed
    const dashOffset = circumference - progress

    const angle = currentPlayed * 360
    const leftAngle = leftHandlePosition * 360
    const rightAngle = rightHandlePosition * 360

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
              style={{ pointerEvents: 'all' }}
              onMouseDown={() => { this.onScrubStart('center') }}
              cx={getCirclePosX(r, angle, r) - 1}
              cy={getCirclePosY(r, angle, r) - 1}
            />
          </g>
        </svg>
        }
        <div
          className={style.timelineClickArea}
          onClick={togglePlay}
          // onMouseDown={() => { this.onScrubStart('center') }}
          onMouseMove={this.onScrub}
          onMouseUp={this.onScrubEnd}
          style={{
            transform: (seeking || seekingLeft || seekingRight) ? 'translate3d(0, 0, 0) scale(10)' : 'translate3d(0, 0, 0)',
            zIndex: (seeking || seekingLeft || seekingRight) ? 100 : ''
          }}
        />
        {round && !!angle && !simple && !showHandles &&
        <div
          className={style.time}
          style={{
            transform: `translate(${getCirclePosX(r, angle, r) - 1}px, ${getCirclePosY(r, angle, r) - 1}px)`
          }}
          onMouseDown={() => { this.onScrubStart('center') }}
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
        {showHandles &&
        <div
          className={style.handle}
          style={{
            transform: `translate(${getCirclePosX(r, leftAngle, r)}px, ${getCirclePosY(r, leftAngle, r)}px)`
          }}
          onMouseDown={() => { this.onScrubStart('left') }}
          onMouseMove={this.onScrub}
          onMouseUp={this.onScrubEnd}
        >
          <div style={{
            transform: `translate(-50%, -50%) rotate(${leftAngle}deg)`
          }}>
            <MdSkipNext
              size={35}
              color={color}
            />
          </div>
        </div>
        }
        {showHandles &&
        <div
          className={style.handle}
          style={{
            transform: `translate(${getCirclePosX(r, rightAngle, r)}px, ${getCirclePosY(r, rightAngle, r)}px)`
          }}
          onMouseDown={() => { this.onScrubStart('right') }}
          onMouseMove={this.onScrub}
          onMouseUp={this.onScrubEnd}
        >
          <div style={{
            transform: `translate(-50%, -50%) rotate(${rightAngle}deg)`
          }}>
            <MdSkipPrevious
              size={35}
              color={color}
            />
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
  round: false,
  showHandles: false
}

Timeline.propTypes = {
  round: PropTypes.bool,
  width: PropTypes.number,
  radius: PropTypes.number,
  color: PropTypes.string.isRequired,
  played: PropTypes.number.isRequired,
  loaded: PropTypes.number.isRequired,
  seekTo: PropTypes.func.isRequired,
  showHandles: PropTypes.bool,
  togglePlay: PropTypes.func.isRequired
}

export default Timeline
