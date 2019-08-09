import React from 'react'
import { connect } from 'react-redux'

import { requestLoginLink } from '../../state/session/actions'

import style from './Login.module.css'

function validateEmail (email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      value: ''
    }
  }

  handleChange (e) {
    this.setState({
      value: e.target.value,
      isMail: validateEmail(e.target.value)
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { session } = this.props
    if (!session.loginLinkLoading && !session.loginLinkSuccess) {
      this.props.requestLoginLink(this.state.value)
    }
  }

  render () {
    const { value, isMail } = this.state
    return [
      <div className={style.backgroundContainer} />,
      <div className={style.container}>
        <img src='/images/diversusIcon.png' className={style.icon} />
        <form onSubmit={this.handleSubmit} className={style.form} autoComplete='on'>
          <input
            className={style.input}
            type='email'
            placeholder='Enter your Email'
            value={value}
            onChange={this.handleChange}
          />
          <input disabled={!isMail} className={style.submit} type='submit' value='Login' />
        </form>
      </div>
    ]
  }
}

function mapStateToProps (state) {
  const { session } = state
  return { session }
}

const mapDispatchToProps = {
  requestLoginLink
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
