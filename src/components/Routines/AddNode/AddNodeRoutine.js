import React from 'react'
import PropTypes from 'prop-types'

import { getAngle, getCirclePosX, getCirclePosY } from '../../Flower/DefaultFunctions'

import WebRecorder from '../WebRecorder'
import Timeline from '../../VideoPlayer/Timeline'

import style from './AddNodeRoutine.module.css'
import FlavorSelector from './FlavorSelector'

class AddNodeRoutine extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      angle: (props.currentTime / props.rootDuration) * 360,
      recorderFinished: false,
      flavorSelected: false,
      seeking: false,
      desiredValue: -1
    }
  }

  recorderFinished = (videoFile) => {
    this.videoFile = videoFile
    this.setState({
      recorderFinished: true
    })
  }

  flavorSelected = (flavor) => {
    this.flavor = flavor
    this.setState({
      flavorSelected: true
    })
  }

  onScrubStart = (e) => {
    this.setState({
      seeking: true
    })
  }

  onScrub = e => {
    if (this.state.seeking) {
      const width = window.innerWidth
      const height = window.innerHeight
      const center = [Math.floor(width * 0.5), Math.floor(height * 0.5)]
      const angle = getAngle(e.clientX, e.clientY, center[0], center[1])
      const progress = angle / 360

      this.currentScrub = progress

      this.setState({
        desiredValue: progress
      })
    }
  }

  onScrubEnd = e => {
    this.setState({
      seeking: false
    })
  }

  render () {
    const { recorderFinished, flavorSelected, desiredValue, seeking } = this.state
    const { currentProgress } = this.props
    const angle = ((desiredValue !== -1) ? desiredValue : currentProgress) * 360
    const width = window.innerWidth
    const height = window.innerHeight
    const center = [Math.floor(width * 0.5), Math.floor(height * 0.5)]
    const maxLength = (width < height) ? width : height
    const rootRadius = Math.floor(maxLength * 0.45 * 0.5)
    const size = Math.floor(rootRadius)

    return [
      <div
        style={{
          transform: `translate(${getCirclePosX(rootRadius + (size * 0.5), angle, center[0])}px, ${getCirclePosY(rootRadius + (size * 0.5), angle, center[1])}px)`,
          position: 'absolute',
          top: 0
        }}
      >
        <div
          className={style.petal}
          style={{
            transform: `translate(-50%, -50%)`,
            width: `${size}px`,
            height: `${size}px`
          }}
          onMouseDown={(flavorSelected) ? this.onScrubStart : () => {}}
          onMouseMove={this.onScrub}
          onMouseUp={(flavorSelected) ? this.onScrubEnd : () => {}}
          onMouseLeave={(flavorSelected) ? this.onScrubEnd : () => {}}
          ref={(ref) => { this.container = ref }}
        >
          <WebRecorder
            size={size}
            recorderFinished={this.recorderFinished}
            color={'grey'}
            showControls={!flavorSelected}
          />
        </div>
        {recorderFinished && !flavorSelected &&
          <FlavorSelector
            size={size}
            flavorSelected={this.flavorSelected}
            angle={angle}
          />
        }
      </div>
      // <div style={{ position: 'absolute', top: center[1], left: center[0], width: `${rootRadius * 2}px`, height: `${rootRadius * 2}px`, transform: 'translate(-50%, -50%)', zIndex: 200 }}>
      //   <Timeline
      //     key='timeline'
      //     round r={rootRadius}
      //     color={'red'}
      //     played={20}
      //     loaded={0}
      //     seekTo={() => {}}
      //     duration={100}
      //     playedSeconds={0}
      //   />
      // </div>
    ]
  }
}

AddNodeRoutine.defaultProps = {
  rootDuration: 0,
  currentTime: 0,
  currentProgress: 0
}

AddNodeRoutine.propTypes = {
  id: PropTypes.string.isRequired,
  rootDuration: PropTypes.number,
  currentTime: PropTypes.number,
  currentProgress: PropTypes.number
}

export default AddNodeRoutine
