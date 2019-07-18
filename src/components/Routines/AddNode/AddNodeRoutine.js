import React from 'react'
import PropTypes from 'prop-types'

import { getCirclePosX, getCirclePosY } from '../../Flower/DefaultFunctions'

import WebRecorder from '../WebRecorder'

import style from './AddNodeRoutine.module.css'
import FlavorSelector from './FlavorSelector'

class AddNodeRoutine extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      angle: (props.currentTime / props.rootDuration) * 360,
      recorderFinished: false,
      flavorSelected: false
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

  render () {
    const { recorderFinished, flavorSelected } = this.state
    const { currentProgress } = this.props
    console.log(currentProgress)
    const angle = currentProgress * 360
    const width = window.innerWidth
    const height = window.innerHeight
    const center = [Math.floor(width * 0.5), Math.floor(height * 0.5)]
    const maxLength = (width < height) ? width : height
    const rootRadius = Math.floor(maxLength * 0.45 * 0.5)
    const size = Math.floor(rootRadius * 1.2)

    return (
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
        >
          <WebRecorder
            size={size}
            recorderFinished={this.recorderFinished}
            color={'grey'}
          />
        </div>
        {recorderFinished && !flavorSelected &&
          <FlavorSelector
            size={size}
            flavorSelected={this.flavorSelected}
          />
        }
      </div>
    )
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
