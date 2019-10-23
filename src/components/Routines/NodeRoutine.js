import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MdChevronRight } from 'react-icons/md'

import { getAngle, getCirclePosX, getCirclePosY } from '../Flower/DefaultFunctions'
import { FLAVORS, SIDEBAR_WIDTH, NAVBAR_HEIGHT } from '../../Defaults'

import { setNewNodePosition, nodeGetsPositioned, stopAddNodeRoutine,
  addNode, editNode, stopEditNodeRoutine } from '../../state/globals/actions'

import VideoLinker from './VideoLinker'
import FlavorSelector from './FlavorSelector'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import TitleInput from './TitleInput'

import FloatingButton from '../UI/FloatingButton'

import style from './Routines.module.css'

const PHASES = [
  { name: 'LINK_VIDEO', title: 'Provide a video link' },
  { name: 'SELECT_FLAVOR', title: 'Select a flavor.' },
  { name: 'ADD_META', title: 'Provide additional information.' },
  { name: 'POSITION', title: 'Position your answer.' }
]

class NodeRoutine extends React.Component {
  constructor (props) {
    super(props)
    const { globals, flowerData, currentTime, currentProgress } = props

    const rootDuration = flowerData[globals.selectedFlower].video.duration
    const selectedPetal = (globals.editNodeRoutineRunning && globals.selectedPetal)
      ? flowerData[globals.selectedFlower].connections.find(
        (connection) => connection.id === parseInt(globals.selectedPetal))
      : undefined

    this.state = {
      angle: currentProgress * 360,
      seeking: false,
      dragPointX: 0,
      dragPointY: 0,
      desiredValue: -1,
      phase: 0,
      animationsFinished: false,
      videoLink: (selectedPetal) ? `https://www.youtube.com/watch?v=${selectedPetal.targetNode.video.url}` : '',
      duration: (selectedPetal) ? selectedPetal.targetNode.video.duration : 0,
      title: (selectedPetal) ? selectedPetal.title : '',
      description: '',
      currentTime: (selectedPetal) ? selectedPetal.sourceIn : currentTime,
      currentProgress: (selectedPetal) ? selectedPetal.sourceIn / rootDuration : currentProgress,
      rootDuration,
      sourceIn: (selectedPetal) ? selectedPetal.sourceIn : 0,
      sourceOut: (selectedPetal) ? selectedPetal.sourceOut : 0,
      targetIn: (selectedPetal) ? selectedPetal.targetIn : 0,
      targetOut: (selectedPetal) ? selectedPetal.targetOut : 0,
      flavor: (selectedPetal) ? selectedPetal.flavor : 'neutral',
      isValidInput: false,
      selectedPetal
    }
  }

  componentDidUpdate () {
    const { globals } = this.props
    const { phase } = this.state
    if (PHASES[phase].name === 'POSITION' && globals.addNodeRoutineRunning && globals.addNodeStatus.finished) {
      this.props.stopAddNodeRoutine()
    } else if (PHASES[phase].name === 'POSITION' && globals.editNodeRoutineRunning && globals.editNodeStatus.finished) {
      this.props.stopEditNodeRoutine()
    }
  }

  componentWillUnmount () {
    this.props.nodeGetsPositioned(false)
  }

  nextPhase = () => {
    const { phase } = this.state
    const nextPhase = phase + 1
    if (PHASES[nextPhase].name === 'POSITION') {
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

      this.setState({
        desiredValue: progress
      })
    }
  }

  onScrubEnd = e => {
    if (this.state.seeking) {
      const { desiredValue, rootDuration } = this.state
      const sourceLink = Math.floor(desiredValue * rootDuration)
      this.setState({
        seeking: false,
        sourceIn: sourceLink,
        sourceOut: sourceLink,
        currentProgress: desiredValue
      })
    }
  }

  onSubmit = () => {
    const { globals } = this.props
    const { selectedPetal } = this.state
    const {
      title, description, flavor, targetIn,
      targetOut, sourceIn, sourceOut, videoLink
    } = this.state
    const data = {
      title,
      description,
      type: 'youtube',
      link: videoLink,
      sourceIn,
      sourceOut,
      targetIn,
      targetOut,
      flavor
    }
    if (globals.addNodeRoutineRunning) {
      this.props.addNode(globals.selectedFlower, { ...data, id: globals.selectedFlower })
    } else if (globals.editNodeRoutineRunning) {
      this.props.editNode(globals.selectedFlower, { ...data, id: selectedPetal.targetNode.id })
    }
  }

  render () {
    const { desiredValue, phase, animationsFinished, flavor, videoLink,
      isValidInput, title, description, seeking, currentProgress } = this.state
    const { dimensions, globals, flowerData } = this.props

    const angle = ((desiredValue !== -1) ? desiredValue : currentProgress) * 360
    const currentRoutine = (globals.editNodeRoutineRunning) ? globals.editNodeStatus : globals.addNodeStatus
    const currentPhase = PHASES[phase]

    let translateX
    let translateY
    let scale
    switch (currentPhase.name) {
      case 'ADD_META':
        translateX = dimensions.centerX
        translateY = dimensions.centerY - 0.3 * dimensions.centerY
        scale = 0.8
        break
      case 'POSITION':
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
        <h2 className={style.phaseTitle}>{currentPhase.title}</h2>
        {currentPhase.name === 'LINK_VIDEO' &&
        <VideoLinker
          finished={this.linkGiven}
          setValidInput={this.setValidInput}
          videoLink={videoLink}
          setVideoLink={(videoLink) => { this.setState({ videoLink }) }}
          setTitle={(title) => { this.setState({ title }) }}
          setDuration={(duration) => { this.setState({ duration, targetOut: duration }) }}
        />
        }
        {currentPhase.name === 'SELECT_FLAVOR' &&
        <FlavorSelector
          selectFlavor={(flavor) => { this.setState({ flavor }) }}
          selectedFlavor={flavor}
          angle={0}
        />
        }
        {currentPhase.name === 'ADD_META' &&
          <TitleInput
            title={title}
            description={description}
            setValidInput={this.setValidInput}
            setTitle={(title) => { this.setState({ title }) }}
            setDescription={(description) => { this.setState({ description }) }}
          />
        }
        {currentPhase.name !== 'POSITION' &&
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
        {currentPhase.name === 'POSITION' &&
        <FloatingButton
          className={style.next}
          style={{
            border: `2px solid ${(!currentRoutine.loading) ? '#222642' : 'grey'}`,
            background: (!currentRoutine.loading) ? '#222642' : 'grey'
          }}
          onClick={this.onSubmit}
          deactivated={currentRoutine.loading}
        >
          {(globals.addNodeRoutineRunning) ? 'Add Petal' : 'Edit Petal'}
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
          onMouseDown={(currentPhase.name === 'POSITION') ? this.onScrubStart : () => {}}
          onTouchStart={(currentPhase.name === 'POSITION') ? this.onScrubStart : () => {}}
          onTouchMove={this.onScrub}
          onTouchEnd={(currentPhase.name === 'POSITION') ? this.onScrubEnd : () => {}}
          ref={(ref) => { this.container = ref }}
        >
          {((currentPhase.name === 'LINK_VIDEO' && isValidInput) ||
          currentPhase.name !== 'LINK_VIDEO') &&
          <VideoPlayer
            url={videoLink}
            color={FLAVORS.find((elem) => elem.type === flavor).color}
            r={dimensions.rootRadius}
            isSelectedPetal={(currentPhase.name !== 'POSITION')}
            // isPetal
            wasSelected
            hideControls={(currentPhase.name === 'POSITION')}
            shouldUpdate={(currentPhase.name !== 'POSITION')}
          />
          }
        </div>
      </div>,
      <div
        key='rootVideo'
        className={style.petal}
        style={{
          transform: `translate(-50%, -50%)`,
          width: `${dimensions.rootSize - 2}px`,
          height: `${dimensions.rootSize - 2}px`,
          zIndex: 5,
          pointerEvents: (currentPhase.name !== 'POSITION') ? 'none' : 'all'
        }}
        ref={(ref) => { this.container = ref }}
      >
        {currentPhase.name === 'POSITION' &&
        <VideoPlayer
          url={`https://www.youtube.com/watch?v=${flowerData[globals.selectedFlower].video.url}`}
          r={dimensions.rootRadius}
          isSelectedPetal
          color={'blue'}
          progress={currentProgress}
          shouldReceiveProgress
          // isPetal
          wasSelected
          // hideControls={(phase === 3)}
          shouldUpdate
        />
        }
      </div>,
      <div
        key='dragContainer'
        onMouseMove={this.onScrub}
        onMouseUp={(currentPhase.name === 'POSITION') ? this.onScrubEnd : () => {}}
        onMouseLeave={(currentPhase.name === 'POSITION') ? this.onScrubEnd : () => {}}
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

NodeRoutine.defaultProps = {
  rootDuration: 0,
  currentTime: 0,
  currentProgress: 0
}

NodeRoutine.propTypes = {
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
  nodeGetsPositioned,
  setNewNodePosition,
  addNode,
  editNode,
  stopAddNodeRoutine,
  stopEditNodeRoutine
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeRoutine)
