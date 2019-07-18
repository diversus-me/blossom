import React from 'react'
import classNames from 'classnames'
import { MdPlayArrow, MdFullscreen } from 'react-icons/md'

import Timeline from './Timeline'

import style from './Controls.module.css'

function FullscreenControls (props) {
  const { playing, color, r, clickPlay,
    toggleFullscreen, played, loaded, seekTo } = props

  return [
    <MdPlayArrow
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
      size={`${r * 0.2}px`}
      fill='#CCC'
      className={style.fullscreen}
      style={{
        margin: `-${r * 0.1}px 0 0 -${r * 0.1}px`
      }}
      onClick={toggleFullscreen}
    />,
    <Timeline
      key='timeline'
      color={color}
      played={played}
      loaded={loaded}
      seekTo={seekTo}
    />
  ]
}

export default FullscreenControls
