import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { IoIosGlasses } from 'react-icons/io'
import { withRouter } from 'react-router'

import style from './Petal.module.css'

import VideoPlayer from '../VideoPlayer/VideoPlayer'

import { FLAVORS } from '../Defaults'

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
  }

  circumference = 1
  currentScrub = 0

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.isSelectedPetal !== nextProps.isSelectedPetal || this.props.petalHidden !== nextProps.petalHidden) {
      return true
    }

    const { r, color } = this.props
    if (r !== nextProps.r || color !== nextProps.color) {
      return true
    }

    const { initialPlay } = this.state

    if (initialPlay !== nextState.initialPlay) {
      return true
    }

    return false
  }

  handleClick = (event) => {
    console.log('YES')
    const { id, selectPetal, isRootNode } = this.props
    if (event.altKey && !isRootNode) {
      this.props.history.push(`/flower/${id}`)
    } else {
      selectPetal((isRootNode) ? undefined : id)
    }
  }

  handleDeepDive = (e) => {
    const { id } = this.props
    e.stopPropagation()
    e.preventDefault()
    this.props.history.push(`/flower/${id}`)
  }

  render () {
    const { r, isSelectedPetal, zoom, color, isRootNode, video, setCurrentTime, petalHidden, flavor } = this.props
    const { wasSelected, initialPlay } = this.state

    const Icon = FLAVORS.find((element) => { console.log(element.name.toLowerCase(), flavor) })

    return (
      <div
        style={{
          width: `${(r * 2) - 2}px`,
          height: `${(r * 2) - 2}px`
          // opacity: (!isSelectedPetal && !initialPlay && !isRootNode) ? 0.5 : 1
        }}
        className={classNames(style.petalContent,
          (isSelectedPetal) ? style.petalContentNoClick : '')}
        onClick={(!petalHidden) ? this.handleClick : () => {}}
      >
        <VideoPlayer
          r={r}
          color={color}
          url={getFullVideoURL(video.url, video.type)}
          setCurrentTime={setCurrentTime}
          shouldUpdate={isSelectedPetal || isRootNode}
          isPetal={!isRootNode}
          isSelectedPetal={isSelectedPetal}
          wasSelected={wasSelected}
          // hideControls={petalHidden}
        />
        {!isRootNode && isSelectedPetal &&
        <IoIosGlasses
          size={r * 0.2}
          color={color}
          style={{
            margin: `-${r * 0.1}px 0 0 0`
          }}
          className={style.deepDive}
          onClick={this.handleDeepDive}
        />
        }
        <div
          className={style.overlay}
          style={{
            background: color,
            opacity: (isSelectedPetal || isRootNode) ? 0 : (r * zoom < 20) ? 1 : 0.7,
            pointerEvents: (!isSelectedPetal) ? 'all' : 'none'
          }}
        >
          {
            // <Icon
            //   size={25}
            //   color={color}
            // />
          }
        </div>
      </div>
    )
  }
}

Petal.defaultProps = {
  isSelectedPetal: false,
  color: 'red',
  zoom: 1,
  isRootNode: false
}

Petal.propTypes = {
  r: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  selectPetal: PropTypes.func.isRequired,
  isSelectedPetal: PropTypes.bool,
  isRootNode: PropTypes.bool,
  zoom: PropTypes.number,
  flavor: PropTypes.string,
  color: PropTypes.string,
  setCurrentTime: PropTypes.func.isRequired,
  video: PropTypes.object.isRequired
}

export default withRouter(Petal)
