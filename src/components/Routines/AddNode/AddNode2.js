import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MdChevronRight } from 'react-icons/md'

import { getAngle, getCirclePosX, getCirclePosY } from '../../Flower/DefaultFunctions'
import { NODE_TYPES } from '../../../state/globals/defaults'
import { FLAVORS, SIDEBAR_WIDTH, NAVBAR_HEIGHT } from '../../../Defaults'

import { setNewNodePosition, nodeGetsPositioned, stopNodeRoutine } from '../../../state/globals/actions'
import { addNode, resetAddNode } from '../../../state/flowerData/actions'

import VideoLinker from '../VideoLinker'
import FlavorSelector from './FlavorSelector'
import VideoPlayer from '../../VideoPlayer/VideoPlayer'
import TitleInput from './TitleInput'

import FloatingButton from '../../UI/FloatingButton'

import style from './AddNode2.module.css'

class AddNodeRoutine extends React.Component {
  constructor (props) {
    super(props)
    const { globals, flowerData, currentTime, currentProgress } = props

    this.PHASES = [
      { name: 'SELECT_FLAVOR', title: 'Select a flavor.' },
      { name: 'ADD_META', title: 'Provide additional information.' },
      { name: 'POSITION', title: 'Position your answer.' }
    ]

    if (globals.addNodeType === NODE_TYPES.RECORD_NODE) {
      this.PHASES.unshift({ name: 'RECORD_VIDEO', title: 'Record a video.' })
    } else if (globals.addNodeType === NODE_TYPES.LINK_NODE) {
      this.PHASES.unshift({ name: 'LINK_VIDEO', title: 'Provide a video link.' })
    } else if (globals.addNodeType === NODE_TYPES.UPLOAD_NODE) {
      this.PHASES.unshift({ name: 'UPLOAD_VIDEO', title: 'Please select a video you want to upload.' })
    }

    const rootDuration = flowerData[globals.selectedFlower].video.duration

    this.state = {
      angle: currentProgress * 360,
      seeking: false,
      dragPointX: 0,
      dragPointY: 0,
      desiredValue: -1,
      phase: 0,
      animationsFinished: false,
      videoLink: '',
      duration: 0,
      title: '',
      description: '',
      currentTime,
      currentProgress,
      rootDuration,
      sourceIn: 0,
      sourceOut: 0,
      targetIn: 0,
      targetOut: 0,
      flavor: 'neutral',
      isValidInput: false
    }

    props.resetAddNode(globals.selectedFlower)
  }

  componentDidUpdate () {
    const { flowerData, globals } = this.props
    const { phase } = this.state
    if (phase === 3 && flowerData[globals.selectedFlower].addNodeFinished) {
      this.props.stopNodeRoutine()
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

  setValidInput = (isValid) => {
    if (isValid !== this.state.validInput) {
      this.setState({ isValidInput: isValid })
    }
  }

  onScrubStart = e => {
    const clientX = (e.touches) ? e.touches[0].clientX : e.clientX
    const clientY = (e.touches) ? e.touches[0].clientY : e.clientY
    const boundingBox = e.target.getBoundingClientRect()
    this.setState({
      seeking: true,
      dragPointX: clientX - boundingBox.x - (boundingBox.width * 0.5),
      dragPointY: clientY - boundingBox.y - (boundingBox.height * 0.5)
    })
  }

  onScrub = e => {
    if (this.state.seeking) {
      const { dragPointX, dragPointY } = this.state
      const { dimensions, sideBarOpen } = this.props
      const clientX = (e.touches) ? e.touches[0].clientX : e.clientX
      const clientY = (e.touches) ? e.touches[0].clientY : e.clientY
      const angle = getAngle(
        clientX - dragPointX,
        clientY - dragPointY,
        (sideBarOpen) ? dimensions.centerX + SIDEBAR_WIDTH * 0.5 : dimensions.centerX,
        dimensions.centerY + NAVBAR_HEIGHT
      )
      const progress = angle / 360

      this.currentScrub = progress

      this.setState({
        desiredValue: progress
      })
    }
  }

  onScrubEnd = e => {
    if (this.state.seeking) {
      const { desiredValue, rootDuration } = this.state
      this.setState({
        seeking: false
      })
      const sourceLink = Math.floor(desiredValue * rootDuration)
      this.setState({ sourceIn: sourceLink, sourceOut: sourceLink })
      this.props.setNewNodePosition(this.state.desiredValue)
    }
  }

  onSubmit = () => {
    const { globals } = this.props
    const {
      title, description, flavor, targetIn, targetOut, sourceIn, sourceOut, videoLink } = this.state
    this.props.addNode(globals.selectedFlower, {
      id: globals.selectedFlower,
      title,
      description,
      type: 'youtube',
      link: videoLink,
      sourceIn,
      sourceOut,
      targetIn,
      targetOut,
      flavor
    })
  }

  render () {
    const { desiredValue, phase, animationsFinished, flavor, videoLink, isValidInput, title, description, seeking } = this.state
    const { currentProgress, dimensions, globals, flowerData } = this.props
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
        translateX = getCirclePosX(dimensions.rootRadius + (dimensions.rootRadius * 0.4), angle, dimensions.centerX)
        translateY = getCirclePosY(dimensions.rootRadius + (dimensions.rootRadius * 0.4), angle, dimensions.centerY)
        scale = 0.4
        break
      default:
        translateX = dimensions.centerX
        translateY = dimensions.centerY
        scale = 1
    }

    return [
      <div
        key='mainContainer'
        className={style.container}
      >
        <h2 className={style.phaseTitle}>{this.PHASES[phase].title}</h2>
        {phase === 0 && globals.addNodeType === NODE_TYPES.LINK_NODE &&
        <VideoLinker
          finished={this.linkGiven}
          setValidInput={this.setValidInput}
          videoLink={videoLink}
          setVideoLink={(videoLink) => { this.setState({ videoLink }) }}
          setTitle={(title) => { this.setState({ title }) }}
          setDuration={(duration) => { this.setState({ duration, targetOut: duration }) }}
        />
        }
        {phase === 1 &&
        <FlavorSelector
          selectFlavor={(flavor) => { this.setState({ flavor }) }}
          selectedFlavor={flavor}
          angle={0}
        />
        }
        {phase === 2 &&
          <TitleInput
            title={title}
            description={description}
            setValidInput={this.setValidInput}
            setTitle={(title) => { this.setState({ title }) }}
            setDescription={(description) => { this.setState({ description }) }}
          />
        }
        {phase !== 3 &&
          <FloatingButton
            className={style.next}
            style={{
              border: `2px solid ${(isValidInput) ? '#222642' : 'grey'}`,
              background: (isValidInput) ? '#222642' : 'grey'
            }}
            onClick={this.nextPhase}
            deactivated={!isValidInput}
            round
          >
            <MdChevronRight
              size={30}
              color={'white'}
            />
          </FloatingButton>
        }
        {phase === 3 &&
        <FloatingButton
          className={style.next}
          style={{
            border: `2px solid ${(!flowerData[globals.selectedFlower].addNodeLoading) ? '#222642' : 'grey'}`,
            background: (!flowerData[globals.selectedFlower].addNodeLoading) ? '#222642' : 'grey'
          }}
          onClick={this.onSubmit}
          deactivated={flowerData[globals.selectedFlower].addNodeLoading}
        >
          Add Petal
        </FloatingButton>
        }
      </div>,
      <div
        key='petalContainer'
        className={style.petalContainer}
        style={{
          transform: `translate(${translateX}px, ${translateY}px)`,
          transition: (animationsFinished) ? 'none' : 'transform 400ms ease-out'
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
          onTouchStart={(phase === 3) ? this.onScrubStart : () => {}}
          onTouchMove={this.onScrub}
          onTouchEnd={(phase === 3) ? this.onScrubEnd : () => {}}
          ref={(ref) => { this.container = ref }}
        >
          {((phase === 0 && isValidInput) || phase > 0) &&
          <VideoPlayer
            url={videoLink}
            color={FLAVORS.find((elem) => elem.type === flavor).color}
            r={dimensions.rootRadius}
            isSelectedPetal={(phase !== 3)}
            // isPetal
            wasSelected
            hideControls={(phase === 3)}
            shouldUpdate={(phase !== 3)}
          />
          }
        </div>
      </div>,
      <div
        key='dragContainer'
        onMouseMove={this.onScrub}
        onMouseUp={(phase === 3) ? this.onScrubEnd : () => {}}
        onMouseLeave={(phase === 3) ? this.onScrubEnd : () => {}}
        style={{
          position: 'absolute',
          width: dimensions.width,
          height: dimensions.height,
          top: 0,
          left: 0,
          zIndex: 10,
          pointerEvents: (seeking) ? 'all' : 'none'
        }} />
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
  const { dimensions, session, globals, flowerData } = state
  return { dimensions, session, globals, flowerData }
}

const mapDispatchToProps = {
  nodeGetsPositioned, setNewNodePosition, addNode, resetAddNode, stopNodeRoutine
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNodeRoutine)
