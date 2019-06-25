import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { MdPlayArrow, MdFullscreen } from 'react-icons/md'
import YouTube from 'react-youtube'
import ZingTouch from 'zingtouch'
import moment from 'moment'
import { withRouter } from 'react-router'

import style from './Petal.module.css'

import { getAngle } from './DefaultFunctions'

import VideoPlayer from './VideoPlayer'

class PetalNative extends React.Component {
  static getDerivedStateFromProps (props, state) {
    if (props.isSelectedPetal && !state.wasSelected) {
      return {
        wasSelected: true
      }
    }
    return null
  }

  state = {
  }

  circumference = 1
  currentScrub = 0

  shouldComponentUpdate (nextProps, nextState) {
    // if (this.props.isSelectedPetal !== nextProps.isSelectedPetal) {
    //   if (!nextProps.isSelectedPetal && this.state.videoPlaying) {
    //     // this.stopVideo()
    //   }
    //   return true
    // }

    // const { zoom, r, color } = this.props

    // if (zoom !== nextProps.zoom || r !== nextProps.r || color !== nextProps.color) {
    //   return true
    // }

    // const { videoPlaying, initialPlay } = this.state

    // if (videoPlaying !== nextState.videoplaying || initialPlay !== nextState.initialPlay) {
    //   return true
    // }

    return true
  }

  componentDidMount () {
    // const region = new ZingTouch.Region(this.timelineTouchArea)
    // const gesture = new ZingTouch.Rotate()

    // region.bind(this.timelineTouchArea, gesture, this.onScrub)
    // window.addEventListener('mouseup', this.endScrub)
  }

  componentWillUnmount () {
    // this.setState({
    //   videoPlaying: false
    // })
  }

  stopVideo = () => {
    // if (this.props.isNativeVideo) {
    //   this.video.pause()
    // } else {
    //   this.video.pauseVideo()
    // }
    // this.setState({
    //   videoPlaying: false
    // })
  }

  handleClick = (event) => {
    // const { id, selectPetal, isRootNode } = this.props
    // if (event.altKey && !isRootNode) {
    //   this.props.history.push(`/flower/${id}`)
    // } else {
    //   selectPetal((isRootNode) ? undefined : id)
    // }
  }

  timelineSelect = (e) => {
    // const { center, duration } = this.props
    // const { videoPlaying } = this.state
    // const angle = getAngle(e.clientX, e.clientY, center[0], center[1])

    // this.video.seekTo(Math.floor(duration * (angle / 360)), true)
    // if (!videoPlaying) {
    //   this.updateTimeline()
    // }
  }

  onScrub = (e) => {
    // const { duration } = this.props
    // const scrubAngle = e.detail.angle
    // const rotatedAngle = 360 - scrubAngle + 90
    // const angle = (rotatedAngle > 360) ? rotatedAngle - 360 : rotatedAngle
    // this.currentScrub = angle / 360

    // if (!this.state.isScrubbing) {
    //   this.setState({ isScrubbing: true })
    // }

    // this.video.seekTo(Math.floor(duration * this.currentScrub), false)
  }

  endScrub = (e) => {
    // if (this.state.isScrubbing) {
    //   const { duration } = this.props
    //   this.setState(
    //     { isScrubbing: false }
    //     , () => { this.video.seekTo(Math.floor(duration * this.currentScrub), true) }
    //   )
    // }
  }

  videoMetaDataLoaded = (e) => {
    // // console.log(this.video)
    // const aspect = this.video.videoWidth / this.video.videoHeight

    // this.setState({
    //   videoWidth: this.video.videoWidth,
    //   videoHeight: this.video.videoHeight,
    //   aspect
    // })
  }

  toggleFullscreen = () => {
    // if (this.video.mozRequestFullScreen) {
    //   this.video.mozRequestFullScreen()
    // } else if (this.video.webkitRequestFullScreen) {
    //   this.video.webkitRequestFullScreen()
    // }
  }

  clickPlay = () => {
    // const { videoPlaying } = this.state

    // if (videoPlaying) {
    //   this.video.pause()
    // } else {
    //   this.video.play()
    // }
  }

  updateTimeline = () => {
    // const { videoPlaying, isScrubbing } = this.state
    // const { isNativeVideo, isSelectedPetal, isRootNode, sendProgress } = this.props

    // if (!isSelectedPetal && videoPlaying) {
    //   return this.stopVideo()
    // }

    // let progressPercent = 0
    // let progress = 0

    // if (isScrubbing) {
    //   progressPercent = this.currentScrub
    // } else {
    //   if (isNativeVideo) {
    //     progressPercent = (this.video.currentTime / this.video.duration)
    //   } else {
    //     progressPercent = (this.video.getCurrentTime() / this.video.getDuration())
    //   }
    // }

    // progress = this.circumference * progressPercent

    // if (this.timeline) {
    //   this.timeline.style.strokeDashoffset = this.circumference - progress
    // }

    // if (isRootNode) {
    //   sendProgress(this.video.getCurrentTime(), progressPercent)
    // }

    // this.setState({ currentTime: Math.floor(this.video.getCurrentTime()) })
    // if (videoPlaying || isScrubbing) {
    //   window.requestAnimationFrame(this.updateTimeline)
    // }
  }

  videoLoaded = () => {
    // const { isSelectedPetal } = this.props
    // if (isSelectedPetal) {
    //   this.clickPlay()
    // }
  }

  render () {
    const { r, isSelectedPetal, zoom, color, isRootNode, isNativeVideo, videoId, duration, node } = this.props
    const { videoPlaying, aspect, wasSelected, initialPlay, currentTime } = this.state
    const videoStyle = {
      marginLeft: `-${Math.floor((r * aspect) - r)}px`,
      height: `${r * 2}px`
    }

    return (
      <div
        style={{ width: `${(r * 2) - 2}px`, height: `${(r * 2) - 2}px`, opacity: (!isSelectedPetal && !initialPlay && !isRootNode) ? 0.5 : 1 }}
        className={classNames(style.petalContent,
          (isSelectedPetal) ? style.petalContentNoClick : '')}
        onClick={this.handleClick}
      >
        {isRootNode &&
          <VideoPlayer
            r={r}
            color={color}
          />
        }
        {/* <div
          className={style.overlay}
          style={{
            background: color,
            opacity: (isSelectedPetal || isRootNode) ? 0 : (r * zoom < 20) ? 1 : 0.7,
            pointerEvents: (!isSelectedPetal && !isNativeVideo) ? 'all' : 'none'
          }}
        /> */}
      </div>
    )
  }
}

PetalNative.defaultProps = {
  isSelectedPetal: false,
  color: 'red',
  zoom: 1,
  isRootNode: false,
  isNativeVideo: false
}

PetalNative.propTypes = {
  r: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  selectPetal: PropTypes.func.isRequired,
  isSelectedPetal: PropTypes.bool,
  isRootNode: PropTypes.bool,
  zoom: PropTypes.number,
  type: PropTypes.string,
  color: PropTypes.string,
  sendProgress: PropTypes.func.isRequired,
  isNativeVideo: PropTypes.bool,
  videoId: PropTypes.string.isRequired,
  center: PropTypes.array.isRequired
}

export default withRouter(PetalNative)
