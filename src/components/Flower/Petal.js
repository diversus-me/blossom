import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IoIosGlasses } from 'react-icons/io'
import { withRouter } from 'react-router'

import { selectPetal } from '../Functions'

import { getFlavor } from '../../Defaults'
import VideoPlayer from '../VideoPlayer/VideoPlayer'

import style from './Petal.module.css'

function getFullVideoURL (url, type) {
  switch (type) {
    case 'youtube':
      return 'https:\\youtube.com/watch?v=' + url
    case 'native':
      return 'https://video.diversus.me/hls/' + url + '/.m3u8'
    default:
      return url
  }
}

class Petal extends React.Component {
  static getDerivedStateFromProps (props, state) {
    if (props.isSelectedPetal && !state.wasSelected) {
      return {
        wasSelected: true
      }
    }
    return null
  }

  state = {
    wasSelected: false
  };

  circumference = 1;
  currentScrub = 0;

  shouldComponentUpdate (nextProps, nextState) {
    if (
      this.props.isSelectedPetal !== nextProps.isSelectedPetal ||
      this.props.petalHidden !== nextProps.petalHidden
    ) {
      return true
    }

    const { r, color, globals } = this.props
    if (
      r !== nextProps.r ||
      color !== nextProps.color ||
      globals.addedNodePosition !== nextProps.globals.addedNodePosition
    ) {
      return true
    }

    const { initialPlay } = this.state

    if (initialPlay !== nextState.initialPlay) {
      return true
    }

    return false
  }

  handleClick = event => {
    const { id, isRootNode, node } = this.props
    if (event.altKey && !isRootNode) {
      this.props.history.push(`/flower/${id}`)
    } else {
      selectPetal(isRootNode ? undefined : node)
    }
  };

  handleDeepDive = e => {
    const { id } = this.props
    e.stopPropagation()
    e.preventDefault()
    this.props.history.push(`/flower/${id}`)
  };

  clickHandler = () => {
    console.log('clicked')
  };

  render () {
    const {
      r,
      isSelectedPetal,
      zoom,
      color,
      isRootNode,
      video,
      setCurrentTime,
      petalHidden,
      globals,
      flavor
    } = this.props
    const { wasSelected } = this.state

    const Flavor = getFlavor(flavor)

    return (
      <div
        onHover={this.clickHandler}
        style={{
          width: `${r * 2 - 2}px`,
          height: `${r * 2 - 2}px`
        }}
        className={classNames(
          style.petalContent,
          isSelectedPetal ? style.petalContentNoClick : ''
        )}
        onClick={!petalHidden ? this.handleClick : () => {}}
      >
        <VideoPlayer
          r={r}
          color={color}
          url={getFullVideoURL(video.url, video.type)}
          setCurrentTime={setCurrentTime}
          shouldUpdate={(isSelectedPetal || isRootNode) &&
            (!globals.addNodeRoutineRunning || globals.editNodeRoutineRunning)}
          isPetal={!isRootNode}
          isSelectedPetal={isSelectedPetal}
          wasSelected={wasSelected}
          showHandles={globals.nodeGetsPositioneds}
          autoplay
          isIFrame
          // hideControls={petalHidden}
        />
        {!isRootNode && isSelectedPetal && (
          <IoIosGlasses
            size={r * 0.2}
            color={color}
            style={{
              margin: `-${r * 0.1}px 0 0 0`
            }}
            className={style.deepDive}
            onClick={this.handleDeepDive}
          />
        )}
        <div
          className={style.overlay}
          style={{
            background: color,
            opacity: isSelectedPetal || isRootNode ? 0 : 1,
            pointerEvents: !isSelectedPetal ? 'visible' : 'none',
            border: `solid 1px ${color}`
          }}
        >
          <img
            className={style.image}
            src={`https://img.youtube.com/vi/${video.url}/sddefault.jpg`}
          />
          <div
            className={style.overlayColor}
            style={{
              background: color,
              opacity:
                isSelectedPetal || isRootNode ? 0 : r * zoom < 20 ? 1 : 0.35
            }}
          />
          <Flavor.icon
            size={r * 0.8}
            color={color}
            className={style.flavorIcon}
          />
        </div>
      </div>
    )
  }
}

Petal.defaultProps = {
  isSelectedPetal: false,
  color: '#222642',
  zoom: 1,
  isRootNode: false
}

Petal.propTypes = {
  r: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  isSelectedPetal: PropTypes.bool,
  isRootNode: PropTypes.bool,
  zoom: PropTypes.number,
  flavor: PropTypes.string,
  color: PropTypes.string,
  setCurrentTime: PropTypes.func.isRequired,
  video: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  const { globals, flower } = state
  return { globals, flower }
}

export default connect(mapStateToProps)(withRouter(Petal))
