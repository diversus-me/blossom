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

class Petal extends React.Component {
  static getDerivedStateFromProps (props, state) {
    if (props.isSelectedPetal && !state.wasSelected) {
      return {
        wasSelected: true
      }
    }
    return null
  }

  constructor (props) {
    super(props)
    this.num = Math.floor(Math.random() * 99)
    this.gender = (Math.random() > 0.5) ? 'women' : 'men'
    this.videoMetaDataLoaded = this.videoMetaDataLoaded.bind(this)
    this.clickPlay = this.clickPlay.bind(this)
    this.updateTimeline = this.updateTimeline.bind(this)
    this.videoLoaded = this.videoLoaded.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.onYoutubeReady = this.onYoutubeReady.bind(this)
    this.onYoutubeStateChange = this.onYoutubeStateChange.bind(this)
    this.onScrub = this.onScrub.bind(this)
    this.endScrub = this.endScrub.bind(this)
    this.timelineSelect = this.timelineSelect.bind(this)
    this.stopVideo = this.stopVideo.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      videoWidth: 0,
      videoHeight: 0,
      aspect: 0,
      wasSelected: false,
      videoPlaying: false,
      initialPlay: true,
      videoReady: false,
      isScrubbing: false,
      currentTime: 0
    }

    this.circumference = 1
    this.currentScrub = 0
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.isSelectedPetal !== nextProps.isSelectedPetal) {
      if (!nextProps.isSelectedPetal && this.state.videoPlaying) {
        // this.stopVideo()
      }
      return true
    }

    const { zoom, r, color } = this.props

    if (zoom !== nextProps.zoom || r !== nextProps.r || color !== nextProps.color) {
      return true
    }

    const { videoPlaying, initialPlay } = this.state

    if (videoPlaying !== nextState.videoplaying || initialPlay !== nextState.initialPlay) {
      return true
    }

    return false
  }

  componentDidMount () {
    const region = new ZingTouch.Region(this.timelineTouchArea)
    const gesture = new ZingTouch.Rotate()

    region.bind(this.timelineTouchArea, gesture, this.onScrub)
    window.addEventListener('mouseup', this.endScrub)
  }

  componentWillUnmount () {
    this.setState({
      videoPlaying: false
    })
  }

  stopVideo () {
    if (this.props.isNativeVideo) {
      this.video.pause()
    } else {
      this.video.pauseVideo()
    }
    this.setState({
      videoPlaying: false
    })
  }

  handleClick (event) {
    const { id, selectPetal, isRootNode } = this.props
    if (event.altKey && !isRootNode) {
      this.props.history.push(`/flower/${id}`)
    } else {
      selectPetal((isRootNode) ? undefined : id)
    }
  }

  timelineSelect (e) {
    const { center, duration } = this.props
    const { videoPlaying } = this.state
    const angle = getAngle(e.clientX, e.clientY, center[0], center[1])

    this.video.seekTo(Math.floor(duration * (angle / 360)), true)
    if (!videoPlaying) {
      this.updateTimeline()
    }
  }

  onScrub (e) {
    const { duration } = this.props
    const scrubAngle = e.detail.angle
    const rotatedAngle = 360 - scrubAngle + 90
    const angle = (rotatedAngle > 360) ? rotatedAngle - 360 : rotatedAngle
    this.currentScrub = angle / 360

    if (!this.state.isScrubbing) {
      this.setState({ isScrubbing: true })
    }

    this.video.seekTo(Math.floor(duration * this.currentScrub), false)
  }

  endScrub (e) {
    if (this.state.isScrubbing) {
      const { duration } = this.props
      this.setState(
        { isScrubbing: false }
        , () => { this.video.seekTo(Math.floor(duration * this.currentScrub), true) }
      )
    }
  }

  videoMetaDataLoaded (e) {
    // console.log(this.video)
    const aspect = this.video.videoWidth / this.video.videoHeight

    this.setState({
      videoWidth: this.video.videoWidth,
      videoHeight: this.video.videoHeight,
      aspect
    })
  }

  toggleFullscreen () {
    if (this.video.mozRequestFullScreen) {
      this.video.mozRequestFullScreen()
    } else if (this.video.webkitRequestFullScreen) {
      this.video.webkitRequestFullScreen()
    }
  }

  clickPlay () {
    const { videoPlaying } = this.state

    if (videoPlaying) {
      this.video.pause()
    } else {
      this.video.play()
    }
  }

  updateTimeline () {
    const { videoPlaying, isScrubbing } = this.state
    const { isNativeVideo, isSelectedPetal, isRootNode, sendProgress } = this.props

    if (!isSelectedPetal && videoPlaying) {
      return this.stopVideo()
    }

    let progressPercent = 0
    let progress = 0

    if (isScrubbing) {
      progressPercent = this.currentScrub
    } else {
      if (isNativeVideo) {
        progressPercent = (this.video.currentTime / this.video.duration)
      } else {
        progressPercent = (this.video.getCurrentTime() / this.video.getDuration())
      }
    }

    progress = this.circumference * progressPercent

    if (this.timeline) {
      this.timeline.style.strokeDashoffset = this.circumference - progress
    }

    if (isRootNode) {
      sendProgress(this.video.getCurrentTime(), progressPercent)
    }

    this.setState({ currentTime: Math.floor(this.video.getCurrentTime()) })
    if (videoPlaying || isScrubbing) {
      window.requestAnimationFrame(this.updateTimeline)
    }
  }

  videoLoaded () {
    const { isSelectedPetal } = this.props
    if (isSelectedPetal) {
      this.clickPlay()
    }
  }

  onYoutubeReady (e) {
    this.video = e.target
    this.video.playVideo()

    this.circumference = Math.PI * (this.props.r - 2) * 2
    this.currentTime = 0
    this.timeline.style.strokeDasharray = this.circumference

    this.setState({
      videoReady: true,
      videoPlaying: true
    }, this.updateTimeline)
  }

  onYoutubeStateChange (e) {
    this.video = e.target
    switch (e.data) {
      case 1:
        this.setState({
          videoPlaying: true,
          initialPlay: false
        }, this.updateTimeline)
        break
      case 2:
        this.setState({
          videoPlaying: false
        })
        break
      default:
        this.setState({
          videoPlaying: false
        })
        break
    }
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
        {wasSelected && isNativeVideo &&
        <video
          ref={ref => { this.video = ref }}
          className={style.image}
          style={videoStyle}
          onLoadedMetadata={this.videoMetaDataLoaded}
          onLoadedData={this.videoLoaded}
          autoPlay
          muted
          loop
        >
          <source src='/Vfe_html5.mp4' />
        </video>}
        {!isNativeVideo && wasSelected &&
        <div className={style.youtube} style={{ marginLeft: r, height: `${r * 2}px` }}>
          <YouTube
            // style={{ position: 'absolute' }}
            // className={style.youtubeIframe}
            containerClassName={style.youtubeIframe}
            videoId={videoId}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
                controls: 0,
                cc_load_policy: 0,
                fs: 1,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                playsinline: 1,
                allowfullscreen: 1,
                frameborder: 0,
                start: (!isRootNode) ? node.targetIn : undefined,
                end: (!isRootNode) ? node.targetOut : undefined
              }
            }}
            onReady={this.onYoutubeReady}
            onStateChange={this.onYoutubeStateChange}
          />
        </div>
        }
        <div
          className={style.image}
          style={{
            opacity: (videoPlaying || !initialPlay) ? 0 : 1,
            backgroundImage: `url(https://img.youtube.com/vi/${videoId}/sddefault.jpg)`
          }}
          // src={`https://randomuser.me/api/portraits/${this.gender}/${this.num}.jpg`}
          // src={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
          ref={(ref) => { this.thumbnail = ref }}
        />
        {((isSelectedPetal || isRootNode) && isNativeVideo) &&
        <MdPlayArrow
          className={classNames(style.play, (videoPlaying) ? style.playClicked : '')}
          size={`${r * 0.5}px`}
          fill={color}
          // strokeWidth="1px"
          stroke='black'
          style={{
            margin: `-${r * 0.25}px 0 0 -${r * 0.25}px`
          }}
          onClick={this.clickPlay}
        />
        }
        { (isSelectedPetal && videoPlaying && isNativeVideo) &&
        <MdFullscreen
          size={`${r * 0.3}px`}
          fill='#CCC'
          className={style.fullscreen}
          style={{
            margin: `-${r * 0.15}px 0 0 -${r * 0.15}px`
          }}
          onClick={this.toggleFullscreen}
        />
        }
        <svg className={style.svg}>
          <g
            ref={(ref) => { this.timelineTouchArea = ref }}
            className={style.timelineTouchArea}
            // onMouseDown={(e) => { this.setState({ isScrubbing: true }) }}
            onMouseLeave={this.endScrub}
            onMouseUp={this.endScrub}
            onClick={this.timelineSelect}
          >
            <circle
              className={style.timelineBackground}
              r={Math.max(0, r - 2)}
              cx={r - (1)}
              cy={r - (1)}
              transform={`rotate(-90 ${r - 1} ${r - 1})`}
            />
            <circle
              className={style.timeline}
              style={{ stroke: color }}
              r={Math.max(0, r - 2)}
              cx={r - (1)}
              cy={r - (1)}
              ref={(ref) => { this.timeline = ref }}
              transform={`rotate(-90 ${r - 1} ${r - 1})`}
            />
            {/* <rect
              width={r * 2}
              height={r * 2}
              style={{ opacity: 0, pointerEvents: (isScrubbing) ? 'all' : 'none' }}
            /> */}
          </g>
        </svg>
        <div className={style.time}>
          <p>{moment.utc(currentTime * 1000).format('mm:ss')} / {moment.utc(duration * 1000).format('mm:ss')}</p>
        </div>
        <div
          className={style.overlay}
          style={{
            background: color,
            opacity: (isSelectedPetal || isRootNode) ? 0 : (r * zoom < 20) ? 1 : 0.7,
            pointerEvents: (!isSelectedPetal && !isNativeVideo) ? 'all' : 'none'
          }}
        />
      </div>
    )
  }
}

Petal.defaultProps = {
  isSelectedPetal: false,
  color: 'red',
  zoom: 1,
  isRootNode: false,
  isNativeVideo: false
}

Petal.propTypes = {
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

export default withRouter(Petal)
