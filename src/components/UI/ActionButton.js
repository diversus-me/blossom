import React, { useState } from 'react'
import { connect } from 'react-redux'
import { MdAdd, MdSlowMotionVideo, MdVideoCall, MdFileUpload } from 'react-icons/md'

import { startNodeRoutine, stopNodeRoutine } from '../../state/globals/actions'
import { NODE_TYPES } from '../../state/globals/defaults'

import style from './ActionButton.module.css'

const SPACING = 20

function ActionButton (props) {
  const { size, startNodeRoutine, stopNodeRoutine } = props
  const [showOptions, setShowOptions] = useState(false)
  const [clicked, setClicked] = useState(false)
  return [
    <div
      key='button'
      className={style.container}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `scale(${(clicked && showOptions) ? 6 : 1})`
        }}
        className={style.bigBG}
        onClick={() => {
          if (!clicked) {
            setClicked(true)
            setShowOptions(true)
          }
        }}
      />
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `scale(${(clicked) ? 1 : 0})`
        }}
        className={style.smallBG}
        onClick={() => {
          setClicked(false)
          setShowOptions(false)
          stopNodeRoutine()
        }
        }
      />
      <MdAdd
        style={{
          transform: `rotate(${(clicked) ? 45 : 0}deg)`
        }}
        size={size - SPACING}
        color={'white'}
        className={style.abort}
      />
      <MdAdd
        style={{
          transform: `rotate(${(clicked) ? 45 : 0}deg)`,
          opacity: (clicked) ? 1 : 0
        }}
        size={size - SPACING}
        color={'#222642'}
        className={style.abort}
      />
      <MdVideoCall
        size={size - SPACING}
        color={'white'}
        className={style.icon}
        style={{
          transform: `translate(${(clicked && showOptions) ? '-80px, 0' : '0, 0'})`,
          opacity: (clicked && showOptions) ? 1 : 0,
          pointerEvents: (clicked && showOptions) ? 'all' : 'none'
        }}
        onClick={() => {
          setShowOptions(false)
          startNodeRoutine(NODE_TYPES.RECORD_NODE)
        }}
      />
      <MdSlowMotionVideo
        size={size - SPACING}
        color={'white'}
        className={style.icon}
        style={{
          transform: `translate(${(clicked && showOptions) ? '-60px, -60px' : '0, 0'})`,
          opacity: (clicked && showOptions) ? 1 : 0,
          pointerEvents: (clicked && showOptions) ? 'all' : 'none'
        }}
        onClick={() => {
          setShowOptions(false)
          startNodeRoutine(NODE_TYPES.LINK_NODE)
        }}
      />
      <MdFileUpload
        size={size - SPACING}
        color={'grey'}
        className={style.icon}
        style={{
          transform: `translate(${(clicked && showOptions) ? '0px, -80px' : '0, 0'})`,
          opacity: (clicked && showOptions) ? 1 : 0,
          pointerEvents: (clicked && showOptions) ? 'none' : 'none'
        }}
        onClick={() => {
          // setShowOptions(false)
          // startNodeRoutine(NODE_TYPES.UPLOAD_NODE)
        }}
      />
    </div>,
    <div
      className={style.outerClick}
      style={{
        opacity: (clicked && showOptions) ? 0.7 : 0,
        pointerEvents: (clicked && showOptions) ? 'all' : 'none'
      }}
      onClick={() => { setClicked(false) }}
    />

  ]
}

function mapStateToProps (state) {
  const { globals } = state
  return {
    globals
  }
}
const mapDispatchToProps = {
  startNodeRoutine, stopNodeRoutine
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionButton)
