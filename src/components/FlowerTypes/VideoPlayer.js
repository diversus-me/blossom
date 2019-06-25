import React from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import FilePlayer from 'react-player/lib/players/FilePlayer'

import Controls from './Controls'
import FullscreenControls from './FullscreenControls'
import Timeline from './Timeline'

import style from './VideoPlayer.module.css'

class VideoPlayer extends React.Component {
  state = {
    playing: false,
    isFullscreen: false,
    progress: 0,
    played: 0,
    loaded: 0,
    playedSeconds: 0
  }

  componentDidMount () {
    screenfull.on('change', () => {
      this.setState({
        isFullscreen: screenfull.isFullscreen
      })
    })
  }

  componentWillUnmount () {
    screenfull.off()
  }

  togglePlay = () => {
    this.setState({
      playing: !this.state.playing
    })
  }

  toggleFullscreen = () => {
    if (screenfull.enabled) {
      screenfull.toggle(findDOMNode(this.fullscreenContainer))
    }
  }

  onProgress = e => {
    this.setState({
      loaded: e.loaded,
      played: e.played,
      playedSeconds: e.playedSeconds
    })
  }

  onDuration = duration => {
    this.setState({
      duration
    })
  }

  seekTo = amount => {
    this.player.seekTo(parseFloat(amount))
  }

  render () {
    const { playing, isFullscreen, played, loaded, playedSeconds, duration } = this.state
    const { color, r } = this.props

    return [
      <div
        key='fullscreenContainer'
        ref={(ref) => { this.fullscreenContainer = ref }}
        className={style.fullscreenContainer}
        style={{ borderRadius: (!isFullscreen) ? '50%' : 0 }}
      >
        <FilePlayer
          key='player'
          url='http://18.185.249.195:8080/hls/webcam-1561063461821.m3u8'
          ref={(ref) => { this.player = ref }}
          playing={playing}
          progressInterval={15}
          onProgress={this.onProgress}
          onDuration={this.onDuration}
          controls={isFullscreen}
          loop
          height={(!isFullscreen) ? '100%' : ''}
          width={(!isFullscreen) ? 'auto' : ''}
          style={{
            marginLeft: (!isFullscreen) ? '-50%' : '',
            top: '50%',
            position: 'relative',
            transform: 'translateY(-50%)'
          }}
          className={style.video}
          onStart={this.onStart}
        />
        {isFullscreen && false &&
        <FullscreenControls
          key='fullscreenControls'
          playing={playing}
          color={color}
          r={r}
          clickPlay={this.togglePlay}
          toggleFullscreen={this.toggleFullscreen}
          played={played}
          loaded={loaded}
          seekTo={this.seekTo}
        />
        }
      </div>,
      <div
        key='clickarea'
        className={style.clickArea}
        onClick={this.clickPause}
      />,
      <Controls
        key='controls'
        playing={playing}
        color={color}
        r={r}
        clickPlay={this.togglePlay}
        toggleFullscreen={this.toggleFullscreen}
        played={played}
        playedSeconds={playedSeconds}
        loaded={loaded}
        seekTo={this.seekTo}
        duration={duration}
      />
    ]
  }
}

export default VideoPlayer
