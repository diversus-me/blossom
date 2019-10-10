import React, { useState } from 'react'
import getVideoId from 'get-video-id'
import { MdOndemandVideo, MdChevronRight } from 'react-icons/md'

import Button from '../UI/Button'
import FloatingButton from '../UI/FloatingButton'

import style from './VideoLinker.module.css'

export default (props) => {
  const [value, setValue] = useState('')
  const [isLink, setIsLink] = useState(false)
  const [showError, setShowError] = useState(false)

  const onChange = (e) => {
    setValue(e.target.value)
    setShowError(false)
    const { id, service } = getVideoId(e.target.value)
    if (id && service === 'youtube') {
      setIsLink(true)
    } else {
      setIsLink(false)
    }
  }

  const onSubmit = () => {
    const { id } = getVideoId(value)
    if (id) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/videoMeta/?videolink=${value}`,
        {
          credentials: 'include',
          method: 'GET'
        })
        .then((res) => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error()
          }
        })
        .then((json) => {
          if (json.duration) {
            props.finished(value, json.duration)
          } else {
            throw new Error()
          }
        })
        .catch(() => { setShowError(true) })
    }
  }

  return [
    <div className={style.container}>
      <input
        className={style.input}
        placeholder='Paste video link here'
        onChange={onChange}
        value={value}
        type='text'
        style={{ color: (showError) ? 'red' : '' }}
      />
      <MdOndemandVideo
        className={style.icon}
        size={25}
      />
      <div className={style.error}>
        {(showError) ? 'The video you requested is invalid' : ''}
      </div>
      <Button
        text={'Done'}
        deactivated={!isLink}
        onClick={onSubmit}
      />
    </div>,
    <FloatingButton
      // className={style.icon}
      style={{
        left: '50%',
        bottom: '25px',
        border: '2px solid #222642',
        marginLeft: '-35px',
        background: '#222642'
      }}
      onClick={() => { this.nextPhase() }}
    >
      <MdChevronRight
        size={30}
        color={'white'}
      />
    </FloatingButton>
  ]
}
