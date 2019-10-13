import React from 'react'
import classNames from 'classnames'
import { MdPlayArrow, MdFullscreen } from 'react-icons/md'

import Timeline from './Timeline'

import style from './Controls.module.css'

function Controls (props) {
  const { playing, color, r, togglePlay, toggleFullscreen, played, loaded,
    seekTo, duration, playedSeconds, simple, isPetal, showHandles } = props

  return [
    <Timeline
      key='timeline'
      round r={r}
      color={color}
      played={played}
      playing={playing}
      loaded={loaded}
      seekTo={seekTo}
      duration={duration}
      playedSeconds={playedSeconds}
      simple={simple}
      showHandles={showHandles}
      togglePlay={togglePlay}
    />,
    <MdPlayArrow
      key='play'
      className={classNames(style.play, (playing) ? style.playClicked : '')}
      size={`${r * 0.7}px`}
      fill={color}
      stroke='white'
      // strokeWidth='0.3px'
      style={{
        margin: `-${r * 0.35}px 0 0 -${r * 0.35}px`
      }}
      onClick={togglePlay}
    />,
    <MdFullscreen
      key='fullscreen'
      size={`${r * 0.2}px`}
      fill={color}
      className={style.fullscreen}
      style={{
        margin: `-${r * 0.1}px 0 0 -${r * ((isPetal) ? 0.2 : 0.1)}px`
      }}
      onClick={toggleFullscreen}
    />
  ]
}

export default Controls
