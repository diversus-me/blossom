import React, { useState } from 'react'
import style from './Login.module.css'

export default ({ handleSubmit }) => {
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
      <div className={style.heading}>diversus</div>
      <input
        className={style.input}
        type='email'
        placeholder='Email'
        value={state.value}
        onChange={handleChange}
      />
      <input disabled={!state.isMail} className={style.submit} onSubmit={handleSubmitLocal} type='submit' value='Login' />
    </form>
  )
}
