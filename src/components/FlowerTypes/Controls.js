import React from 'react'
import classNames from 'classnames'
import { MdPlayArrow, MdFullscreen } from 'react-icons/md'

import Timeline from './Timeline'

import style from './Controls.module.css'

function Controls (props) {
  const { playing, color, r, clickPlay, toggleFullscreen, played, loaded, seekTo, duration, playedSeconds } = props

  return [
    <Timeline
      key='timeline'
      round r={r}
      color={color}
      played={played}
      loaded={loaded}
      seekTo={seekTo}
      duration={duration}
      playedSeconds={playedSeconds}
    />,
    <MdPlayArrow
      key='play'
      className={classNames(style.play, (playing) ? style.playClicked : '')}
      size={`${r * 0.5}px`}
      fill={color}
      stroke='black'
      style={{
        margin: `-${r * 0.25}px 0 0 -${r * 0.25}px`
      }}
      onClick={clickPlay}
    />,
    <MdFullscreen
      key='fullscreen'
      size={`${r * 0.2}px`}
      fill={color}
      className={style.fullscreen}
      style={{
        margin: `-${r * 0.1}px 0 0 -${r * 0.1}px`
      }}
      onClick={toggleFullscreen}
    />
  ]
}

export default Controls
