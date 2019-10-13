import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getAngle, getCirclePosX, getCirclePosY } from '../../Flower/DefaultFunctions'
import { setNewNodePosition, nodeGetsPositioned } from '../../../state/globals/actions'
import { NODE_TYPES } from '../../../state/globals/defaults'

import VideoLinker from '../VideoLinker'
import FlavorSelector from './FlavorSelector'
import VideoPlayer from '../../VideoPlayer/VideoPlayer'

import style from './AddNodeRoutine.module.css'

class AddNodeRoutine extends React.Component {
  constructor (props) {
    super(props)
    this.PHASES = [
      { name: 'SELECT_FLAVOR', title: 'Select a flavor.' },
      { name: 'ADD_META', title: 'Provide additional information.' },
      { name: 'POSITION', title: 'Position your answer.' }
    ]

    if (props.globals.addNodeType === NODE_TYPES.RECORD_NODE) {
      this.PHASES.unshift({ name: 'RECORD_VIDEO', title: 'Record a video.' })
    } else if (props.globals.addNodeType === NODE_TYPES.LINK_NODE) {
      this.PHASES.unshift({ name: 'LINK_VIDEO', title: 'Provide a video link.' })
    } else if (props.globals.addNodeType === NODE_TYPES.UPLOAD_NODE) {
      this.PHASES.unshift({ name: 'UPLOAD_VIDEO', title: 'Please select a video you want to upload.' })
    }

    this.state = {
      angle: (props.currentTime / props.rootDuration) * 360,
      seeking: false,
      desiredValue: -1,
      phase: 0,
      animationsFinished: false,
      uploadUrl: '',
      videoLink: '',
      title: '',
      description: '',
      currentTime: props.currentTime,
      currentProgress: props.currentProgress,
      sourceIn: '00:00:00',
      sourceOut: '00:00:00',
      targetIn: '00:00:00',
      targetOut: '00:00:00',
      flavor: 'neutral',
      validInput: false
    }
  }

  componentWillUnmount () {
    this.props.nodeGetsPositioned(false)
  }

  nextPhase = () => {
    const { phase } = this.state
    const nextPhase = phase + 1
    if (nextPhase === 3) {
      this.props.nodeGetsPositioned(true)
      this.setState({
        phase: nextPhase
      }, () => {
        setTimeout(() => {
          this.setState({
            animationsFinished: true
          })
        }, 500)
      })
    } else {
      this.setState({
        phase: nextPhase
      })
    }
  }

  flavorSelected = (flavor) => {
    this.flavor = flavor
    this.nextPhase()
    this.setState({
      flavorSelected: true
    })
  }

  linkGiven = (videoLink) => {
    this.nextPhase()
    this.setState({
      videoLink
    })
  }

  metaInformationSet = () => {
    this.nextPhase()
    this.props.nodeGetsPositioned(true)
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
    if (this.state.seeking) {
      this.setState({
        seeking: false
      })
      this.props.setNewNodePosition(this.state.desiredValue)
    }
  }

  render () {
    const { desiredValue, phase, animationsFinished, videoLink } = this.state
    const { currentProgress, dimensions, globals } = this.props
    const angle = ((desiredValue !== -1) ? desiredValue : currentProgress) * 360

    let translateX
    let translateY
    let scale
    switch (phase) {
      case 2:
        translateX = dimensions.centerX
        translateY = dimensions.centerY - 0.3 * dimensions.centerY
        scale = 0.8
        break
      case 3:
        translateX = getCirclePosX(dimensions.rootRadius + (dimensions.rootRadius * 0.5), angle, dimensions.centerX)
        translateY = getCirclePosY(dimensions.rootRadius + (dimensions.rootRadius * 0.5), angle, dimensions.centerY)
        scale = 0.5
        break
      default:
        translateX = dimensions.centerX
        translateY = dimensions.centerY
        scale = 1
    }

    let titlePositionY = (translateY - dimensions.rootSize) * 0.7

    // console.log(phase, this.PHASES)

    return [
      <div
        className={style.phase}
        style={{
          top: (phase === 3 && (angle > 45 && angle < 315)) ? '6%' : '',
          bottom: (phase === 3 && (angle < 45 || angle > 315)) ? '6%' : '',
          transform: (phase !== 3) ? `translateY(${(titlePositionY > 25) ? titlePositionY : 25}px)` : ''
        }}
      >
        <h2 className={style.phaseTitle}>{this.PHASES[phase].title}</h2>
      </div>,
      <div
        key='container'
        style={{
          transform: `translate(${translateX}px, ${translateY}px)`,
          transition: (animationsFinished) ? 'none' : 'transform 400ms ease-out',
          position: 'absolute',
          top: 0
        }}
      >
        <div
          className={style.petal}
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            transition: 'transform 400ms ease-out',
            width: `${dimensions.rootSize}px`,
            height: `${dimensions.rootSize}px`
          }}
          onMouseDown={(phase === 3) ? this.onScrubStart : () => {}}
          onMouseMove={this.onScrub}
          onMouseUp={(phase === 3) ? this.onScrubEnd : () => {}}
          onMouseLeave={(phase === 3) ? this.onScrubEnd : () => {}}
          ref={(ref) => { this.container = ref }}
        >
          {phase > 0 && globals.addNodeType === NODE_TYPES.LINK_NODE &&
            <VideoPlayer
              url={videoLink}
              color={'#222642'}
              r={dimensions.rootRadius}
              isSelectedPetal={(phase !== 3)}
              // isPetal
              wasSelected
              hideControls={(phase === 3)}
              shouldUpdate={(phase !== 3)}
            />
          }
        </div>
        {phase === 1 &&
          <FlavorSelector
            size={dimensions.rootSize}
            flavorSelected={this.flavorSelected}
            angle={angle}
          />
        }
        {phase === 0 && globals.addNodeType === NODE_TYPES.LINK_NODE &&
        <VideoLinker
          finished={this.linkGiven}
        />
        }
      </div>,
      <div>
        {phase === 2 &&
        <div className={style.inputContainer} style={{ top: `${(dimensions.centerY * 1.2)}px` }}>
          <input className={style.title} type='text' placeholder='Add a Title' />
          <textarea className={style.description} type='text' cols='40' rows='5' placeholder='Add a Description' />
        </div>
        }
      </div>
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

function mapStateToProps (state) {
  const { dimensions, session, globals } = state
  return { dimensions, session, globals }
}

const mapDispatchToProps = {
  nodeGetsPositioned, setNewNodePosition
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNodeRoutine)
