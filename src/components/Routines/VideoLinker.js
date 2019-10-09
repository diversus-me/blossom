import React, { useState } from 'react'
import getVideoId from 'get-video-id'
import { MdOndemandVideo } from 'react-icons/md'

import Button from '../UI/Button'

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
    console.log(id)
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

  return (
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
    </div>
  )
}
