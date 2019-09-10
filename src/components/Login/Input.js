import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'

import style from './Login.module.css'

export default ({ handleSubmit, error, disabled }) => {
  const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const [state, setState] = useState({
    value: '',
    isMail: false
  })

  const handleChange = (e) => {
    setState({
      value: e.target.value,
      isMail: validateEmail(e.target.value)
    })
  }

  const handleSubmitLocal = (e) => {
    e.preventDefault()
    handleSubmit(state.value)
  }

  return (
    <form onSubmit={handleSubmitLocal} className={style.form} autoComplete='on'>
      <TextField
        id='outlined-email-input'
        label='Email'
        className={style.input}
        type='email'
        name='email'
        autoComplete='email'
        margin='dense'
        value={state.value}
        onChange={handleChange}
        variant='outlined'
        inputProps={{ style: { textAlign: 'center' } }}
        hintProps={{ style: { textAlign: 'center' } }}
      />
      <input disabled={!state.isMail || disabled} className={style.submit} onSubmit={handleSubmitLocal} type='submit' value='Login' />
    </form>
  )
}
