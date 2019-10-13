import React, { useState } from 'react'

import style from './Login.module.css'
import Textfield from '../UI/Textfield'

const validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default ({ handleSubmit, disabled, error }) => {
  const [state, setState] = useState({
    value: '',
    isMail: false,
    didChange: true
  })

  const handleChange = (val) => {
    setState({
      value: val,
      isMail: validateEmail(val),
      didChange: true
    })
  }

  const handleSubmitLocal = (e) => {
    e.preventDefault()
    handleSubmit(state.value)
    setState({
      didChange: false
    })
  }

  return (
    <form
      onSubmit={handleSubmitLocal}
      className={style.form}
      autoComplete='on'
    >
      <Textfield
        onChange={handleChange}
        type='email'
        autoComplete='email'
        error={(!state.didChange) ? error : undefined}
      />
      <input
        disabled={!state.isMail || disabled}
        className={style.submit}
        onSubmit={handleSubmitLocal}
        type='submit'
        value='Login'
      />
    </form>
  )
}
