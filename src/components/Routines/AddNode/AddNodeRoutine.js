import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IoIosCheckmark } from 'react-icons/io'
import Uppy from '@uppy/core'
import AWS3 from '@uppy/aws-s3'

import { getAngle, getCirclePosX, getCirclePosY } from '../../Flower/DefaultFunctions'
import { setNewNodePosition, nodeGetsPositioned } from '../../../state/globals/actions'
import { fetchAsync } from '../../../state/helpers'

import WebRecorder from '../WebRecorder'
import FlavorSelector from './FlavorSelector'
import FloatingButton from '../../UI/FloatingButton'

import style from './AddNodeRoutine.module.css'

const PHASES = [
  { name: 'RECORD_VIDEO', title: 'Record a video.' },
  { name: 'SELECT_FLAVOR', title: 'Select a flavor.' },
  { name: 'ADD_META', title: 'Provide additional information.' },
  { name: 'POSITION', title: 'Position your answer.' }
]

const uppy = Uppy({
  meta: { type: 'avatar' },
  restrictions: { maxNumberOfFiles: 1 },
  autoProceed: true
})

// uppy.use(Webcam, {
//   modes: [
//     'video-audio'
//   ]
// })
uppy.use(AWS3, {
  companionUrl: process.env.REACT_APP_SERVER_URL + '/uppy'
})
// const uppy = Uppy({ autoProceed: false })
// uppy.use(AWS3, {
//   limit: 2,
//   timeout: 60000,
//   companionUrl: process.env.REACT_APP_SERVER_URL
// })

class AddNodeRoutine extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      angle: (props.currentTime / props.rootDuration) * 360,
      seeking: false,
      desiredValue: -1,
      uploadUrl: '',
      phase: 0,
      animationsFinished: false
    }

    // fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/uploadLink`,
    //   {
    //     method: 'GET'
    //   })
    //   .then((res) => {
    //     if (res.ok) {
    //       return res.json()
    //     } else {
    //       throw new Error()
    //     }
    //   })
    //   .then((json) => {
    //     this.setState({ uploadUrl: json.url })
    //   })
    //   .catch((error) => { console.log(error) })
  }

  componentWillUnmount () {
    this.props.nodeGetsPositioned(false)
    uppy.reset()
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

  recorderFinished = async (videoFile) => {
    this.videoFile = videoFile

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/requestUppy`,
        {
          credentials: 'include',
          method: 'GET'
        })
      const json = await response.json()

      console.log(videoFile.fileExtension)

      uppy.addFile({
        ...videoFile,
        name: `${this.props.session.id}.${json.videoID}.${videoFile.fileExtension}`
      })

      uppy.upload().then((result) => {
        console.info('Successful uploads:', result.successful)

        if (result.failed.length > 0) {
          console.error('Errors:')
          result.failed.forEach((file) => {
            console.error(file.error)
          })
        }
      })

      console.log('finisshed')
      this.nextPhase()
    } catch (errors) {
      console.log(errors)
    }
    // fetch(
    //   this.state.uploadUrl,
    //   {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': videoFile.type,
    //       headers: { 'Content-Type': 'video/*', 'x-amz-acl': 'public-read' },
    //       'Access-Control-Request-Headers': 'content-type'
    //     },
    //     file: videoFile
    //   }
    // ).then((response) => { console.log(response) })
    // .catch((error) => { console.log(error) })
  }

  flavorSelected = (flavor) => {
    this.flavor = flavor
    this.nextPhase()
    this.setState({
      flavorSelected: true
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
    const { desiredValue, phase, animationsFinished } = this.state
    const { currentProgress, dimensions } = this.props
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

    return [
      <div
        className={style.phase}
        style={{
          top: (phase === 3 && (angle > 45 && angle < 315)) ? '6%' : '',
          bottom: (phase === 3 && (angle < 45 || angle > 315)) ? '6%' : '',
          transform: (phase !== 3) ? `translateY(${(titlePositionY > 25) ? titlePositionY : 25}px)` : ''
        }}
      >
        <h2 className={style.phaseTitle}>{PHASES[phase].title}</h2>
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
          <WebRecorder
            size={dimensions.rootSize}
            recorderFinished={this.recorderFinished}
            color={'grey'}
            showControls={phase === 1 || phase === 2}
          />
        </div>
        {phase === 1 &&
          <FlavorSelector
            size={dimensions.rootSize}
            flavorSelected={this.flavorSelected}
            angle={angle}
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
        {true &&
        <FloatingButton
          // className={style.icon}
          style={{
            right: '75px',
            background: 'green'
          }}
          onClick={() => { this.nextPhase() }}
        >
          <IoIosCheckmark
            size={25}
            color={'white'}
          />
          {/* Next Step */}
        </FloatingButton>
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
  const { dimensions, session } = state
  return { dimensions, session }
}

const mapDispatchToProps = {
  nodeGetsPositioned, setNewNodePosition
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNodeRoutine)
