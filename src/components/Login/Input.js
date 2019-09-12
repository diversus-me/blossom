import React, { useState } from 'react'

import style from './Login.module.css'
import Textfield from '../UI/Textfield';

export default ({ handleSubmit, disabled }) => {
  const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const [state, setState] = useState({
    value: '',
    isMail: false
  })

  const handleChange = (val) => {
    setState({
      value: val,
      isMail: validateEmail(val)
    })
  }

  const handleSubmitLocal = (e) => {
    e.preventDefault()
    handleSubmit(state.value)
  }

  return (
    <form onSubmit={handleSubmitLocal} className={style.form} autoComplete='on'>
      <Textfield
        onChange={handleChange}
        type="email"
        autoComplete="email"
        error=""
      />
      <input disabled={!state.isMail || disabled} className={style.submit} onSubmit={handleSubmitLocal} type='submit' value='Login' />
    </form>
  )
}
