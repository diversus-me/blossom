import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { MdAdd } from 'react-icons/md'
import { toast } from 'react-toastify'

import style from './Admin.module.css'

class AddUser extends React.Component {
  state = {
    name: '',
    email: ''
  }

  handleClick = () => {
    const { email, name } = this.state
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/user`,
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name })
      })
      .then(response => {
        if (response.ok) {
          return response
        } else {
          throw new Error('failed')
        }
      })
      .then(() => this.setState({ name: '', email: '' }))
      .then(() => toast.success('User successfully added'))
      .then(this.props.reload)
      .catch(() => {
        toast.error('User could not be added.')
      })
  }

  handleChange = (e, type) => {
    switch (type) {
      case 'name':
        this.setState({
          name: e.target.value
        })
        break
      case 'mail':
        this.setState({
          email: e.target.value
        })
        break
      default:
        break
    }
  }

  render () {
    const { email, name } = this.state
    return (
      <tr>
        <td>
          <input
            value={name}
            type='name'
            onChange={e => this.handleChange(e, 'name')}
          />
        </td>
        <td>
          <input
            value={email}
            type='email'
            onChange={e => this.handleChange(e, 'mail')}
          />
        </td>
        <td />
        <td>
          <div
            className={classNames(style.button, style.addUser)}
            onClick={this.handleClick}
          >
            <MdAdd color='white' />
          </div>
        </td>
      </tr>
    )
  }
}

AddUser.propTypes = {
  reload: PropTypes.func.isRequired
}

export default AddUser
