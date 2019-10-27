import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import style from './TitleInput.module.css'

function checkInput (title, description) {
  if (title.length > 5) {
    return true
  }
  return false
}

function TitleInput (props) {
  const { dimensions, title, description, setValidInput, setTitle, setDescription } = props

  useEffect(() => {
    setValidInput(checkInput(title, description))
  }, [])

  const onChangeTitle = (e) => {
    setTitle(e.target.value)
    setValidInput(checkInput(title, description))
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
    setValidInput(checkInput(title, description))
  }

  return (
    <div
      className={style.inputContainer}
      style={{ top: `${(dimensions.centerY * 1.2)}px` }}
    >
      <input
        className={style.title}
        type='text'
        placeholder='Add a Title'
        value={title}
        onChange={onChangeTitle}
      />
      <textarea
        className={style.description}
        type='text'
        cols='40'
        rows='5'
        placeholder='Add a Description'
        value={description}
        onChange={onChangeDescription}
      />
    </div>
  )
}

function mapStateToProps (state) {
  const { dimensions } = state
  return { dimensions }
}

export default connect(mapStateToProps)(TitleInput)
